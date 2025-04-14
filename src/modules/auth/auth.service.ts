import jwt from "jsonwebtoken";
import { UserService } from "../user/user.service";
import { ValidationError, AuthenticationError } from "../../lib/utils/error.utils";
import { IUser } from "../../models/User";
import { promisify } from "util";
import crypto from "crypto";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export class AuthService {
  private static authService: AuthService;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.authService) {
      AuthService.authService = new AuthService();
    }
    return AuthService.authService;
  }

  private generateToken(user: IUser): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        username: user.username,
        preferences: user.preferences,
        version: 1 // For token invalidation if needed
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: "24h",
        audience: 'portforyou-api',
        issuer: 'portforyou-auth'
      }
    );
  }

  private async checkLoginAttempts(user: IUser): Promise<void> {
    // Check if account is currently locked
    if (user.locked && user.lastLoginAttempt) {
      const lockUntil = new Date(user.lastLoginAttempt.getTime() + LOCK_TIME);
      if (lockUntil > new Date()) {
        const minutesLeft = Math.ceil((lockUntil.getTime() - new Date().getTime()) / 1000 / 60);
        throw new AuthenticationError(`Account is locked. Please try again in ${minutesLeft} minutes`);
      } else {
        // Lock period has expired, reset the counter
        user.loginAttempts = 0;
        user.locked = false;
        await user.save();
      }
    }
  }

  private async incrementLoginAttempts(user: IUser): Promise<void> {
    user.loginAttempts += 1;
    user.lastLoginAttempt = new Date();
    
    // Lock the account if max attempts is reached
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.locked = true;
    }
    
    await user.save();
  }

  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // Use the same error message to prevent user enumeration
      throw new AuthenticationError("Invalid email or password");
    }

    // Check if account is locked
    await this.checkLoginAttempts(user);

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await this.incrementLoginAttempts(user);
      throw new AuthenticationError("Invalid email or password");
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.locked = false;
    await user.save();

    const token = this.generateToken(user);
    return { token, user };
  }

  async register(
    userData: Partial<IUser>
  ): Promise<{ token: string; user: IUser }> {
    const existingUser = await this.userService.getUserByEmail(userData.email!);
    
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }

    // Validate password
    if (!userData.password || userData.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }

    const user = await this.userService.createUser({
      ...userData,
      loginAttempts: 0,
      locked: false
    });

    const token = this.generateToken(user);
    return { token, user };
  }

  async generatePasswordResetToken(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // Don't reveal whether the email exists
      return;
    }

    const buffer = await promisify(crypto.randomBytes)(32);
    const token = buffer.toString('hex');

    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Send password reset email
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userService.findOneByQuery({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new ValidationError("Invalid or expired password reset token");
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }
}
