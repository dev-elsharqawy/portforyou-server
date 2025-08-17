import logger from "../../lib/utils/logger";
import { User } from "../../models/User";
import { IUser } from "../../models/User";
import { createDotNotationUpdate } from "../../lib/utils/object.utils";
import { IArikTemplate } from "../../lib/types/template.types";
import { handleMongoError } from "../../lib/utils/error.utils";
import { Visitor } from "../../models/Visitor";
import { INovaTemplate } from "../../lib/types/template.types"; // Import INovaTemplate

export class UserService {
  private static userService: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.userService) {
      UserService.userService = new UserService();
    }
    return UserService.userService;
  }

  async getAllUsers(requestingUser: IUser): Promise<IUser[]> {
    if (!requestingUser.isAdmin) {
      throw new Error("You don't have permission to access all users");
    }
    return User.find();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User({
        ...userData,
        email: userData.email?.toLowerCase(),
      });

      return await user.save();
    } catch (error: any) {
      throw handleMongoError(error);
    }
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      return User.findByIdAndUpdate(id, createDotNotationUpdate('', userData), {
        new: true,
      });
    } catch (error: any) {
      throw handleMongoError(error);
    }
  }

  async findOneByQuery(query: Record<string, any>): Promise<IUser | null> {
    return User.findOne(query);
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error("Error deleting user:", { error, userId: id });
      throw error;
    }
  }

  async updateUserTemplate(
    id: string,
    template: Partial<IArikTemplate>
  ): Promise<IUser | null> {
    try {
      // Create a deep copy to avoid modifying the input
      const updatedTemplate = JSON.parse(JSON.stringify(template));

      // Validate logos array length if present
      if (Array.isArray(updatedTemplate?.logos)) {
        if (updatedTemplate.logos.length !== 6) {
          throw new Error('Logos array must contain exactly 6 items');
        }
      }

      // Create update object with dot notation
      const updateObj = createDotNotationUpdate("arikTemplate", updatedTemplate);

      // Only proceed if there are actual updates
      if (Object.keys(updateObj).length === 0) {
        return User.findById(id);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateObj },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error(`User not found with id: ${id}`);
      }

      return updatedUser;
    } catch (error) {
      logger.error("Error updating user template:", { error, userId: id });
      throw error;
    }
  }

  async updateNovaTemplate(
    id: string,
    template: Partial<INovaTemplate>
  ): Promise<IUser | null> {
    try {
      // Create a deep copy to avoid modifying the input
      const updatedTemplate = JSON.parse(JSON.stringify(template));

      // Create update object with dot notation
      const updateObj = createDotNotationUpdate("novaTemplate", updatedTemplate);

      // Only proceed if there are actual updates
      if (Object.keys(updateObj).length === 0) {
        return User.findById(id);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateObj },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error(`User not found with id: ${id}`);
      }

      return updatedUser;
    } catch (error) {
      logger.error("Error updating nova template:", { error, userId: id });
      throw error;
    }
  }

  async addSelectedTemplate(
    id: string,
    templateName: string
  ): Promise<IUser | null> {
    try {
      return User.findByIdAndUpdate(
        id,
        { $addToSet: { selectedTemplates: templateName } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error("Error adding selected template:", {
        error,
        userId: id,
        templateName,
      });
      throw error;
    }
  }

  async removeSelectedTemplate(
    id: string,
    templateName: string
  ): Promise<IUser | null> {
    try {
      return User.findByIdAndUpdate(
        id,
        { $pull: { selectedTemplates: templateName } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error("Error removing selected template:", {
        error,
        userId: id,
        templateName,
      });
      throw error;
    }
  }

  async updateUserPreferences(
    id: string,
    preferences: { colors: string[]; profession: string }
  ): Promise<IUser | null> {
    try {
      return User.findByIdAndUpdate(
        id,
        {
          $set: {
            preferences: preferences, 
          },
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error("Error updating user preferences:", {
        error,
        userId: id,
        preferences,
      });
      throw handleMongoError(error);
    }
  }

  async recordTemplateVisit(
    userId: string,
    templateName: string,
    visitorData: {
      ip: string;
      country: string;
      browser: string;
      device: "mobile" | "desktop";
    }
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User not found with id: ${userId}`);
      }

      // Create a new visitor record
      const visitor = new Visitor({
        ...visitorData,
        visitDate: new Date(),
      });

      // Update the analytics for the template
      if (templateName === 'arik') {
        // Check if the user has the arikTemplate field
        if (!user.arikTemplate) {
          throw new Error(`Arik template not found for user ${userId}`);
        }
        
        const updateResult = await User.findByIdAndUpdate(
          userId,
          {
            $push: { "arikTemplate.analytics.visitors": visitor },
            $inc: { "arikTemplate.analytics.totalVisits": 1 },
          },
          { new: true }
        );

        return !!updateResult;
      } else if (templateName === 'nova') {
        // Check if the user has the novaTemplate field
        if (!user.novaTemplate) {
          throw new Error(`Nova template not found for user ${userId}`);
        }
        
        const updateResult = await User.findByIdAndUpdate(
          userId,
          {
            $push: { "novaTemplate.analytics.visitors": visitor },
            $inc: { "novaTemplate.analytics.totalVisits": 1 },
          },
          { new: true }
        );

        return !!updateResult;
      }

      // For future template types, add handling here
      throw new Error(`Template type ${templateName} analytics not implemented yet`);
    } catch (error) {
      logger.error("Error recording template visit:", {
        error,
        userId,
        templateName,
        visitorData,
      });
      throw error;
    }
  }

  async getTemplateAnalytics(userId: string, templateName: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User not found with id: ${userId}`);
      }

      if (templateName === 'arik') {
        // Check if the user has the arikTemplate field
        if (!user.arikTemplate) {
          throw new Error(`Arik template not found for user ${userId}`);
        }
        return user.arikTemplate.analytics || { visitors: [], totalVisits: 0 };
      } else if (templateName === 'nova') {
        // Check if the user has the novaTemplate field
        if (!user.novaTemplate) {
          throw new Error(`Nova template not found for user ${userId}`);
        }
        return user.novaTemplate.analytics || { visitors: [], totalVisits: 0 };
      }

      // For future template types, add handling here
      throw new Error(`Template type ${templateName} analytics not implemented yet`);
    } catch (error) {
      logger.error("Error getting template analytics:", {
        error,
        userId,
        templateName,
      });
      throw error;
    }
  }
}
