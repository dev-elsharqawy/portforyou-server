import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { UserService } from "../../user/user.service";
import logger from "../../../lib/utils/logger";
import { TokenPayload, AuthenticatedContext } from "../types/auth.types";
import { Request } from "express";

interface GraphQLContext {
  req?: Request;
  request?: Request;
  headers?: Record<string, string>;
}

export class GraphQLAuthMiddleware {
  private static instance: GraphQLAuthMiddleware;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): GraphQLAuthMiddleware {
    if (!GraphQLAuthMiddleware.instance) {
      GraphQLAuthMiddleware.instance = new GraphQLAuthMiddleware();
    }
    return GraphQLAuthMiddleware.instance;
  }

  public authenticateContext = async (
    context: GraphQLContext
  ): Promise<AuthenticatedContext> => {
    try {
      const token = this.extractTokenFromContext(context);
      if (!token) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
      }

      const decoded = await this.verifyToken(token);
      const user = await this.userService.getUserById(decoded.userId);

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
      }

      return { user, token };
    } catch (error) {
      logger.error("GraphQL Authentication error:", error);
      if (error instanceof GraphQLError) throw error;

      throw new GraphQLError("Authentication failed", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
      });
    }
  };

  private extractTokenFromContext(context: GraphQLContext): string | null {
    // Try to get token from different possible context structures
    const authHeader =
      context?.req?.headers?.authorization || // Express-like context
      context?.request?.headers?.authorization || // Apollo Server context
      context?.headers?.authorization || // Direct headers
      (typeof context === "object" && "authorization" in context
        ? context.authorization
        : null); // Plain object

    return this.extractTokenFromHeader(authHeader as string);
  }

  private extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) return null;

    return token;
  }

  private async verifyToken(token: string): Promise<TokenPayload> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    try {
      const decoded = jwt.verify(token, secret, {
        audience: 'portforyou-api',
        issuer: 'portforyou-auth'
      }) as TokenPayload;

      if (decoded.exp < Date.now() / 1000) {
        throw new GraphQLError("Token has expired", {
          extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new GraphQLError("Invalid token", {
          extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
      }
      throw error;
    }
  }
}
