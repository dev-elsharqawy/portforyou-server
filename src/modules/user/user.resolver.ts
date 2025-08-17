import { UserService } from "./user.service";
import { formatError } from "../../lib/utils/error.utils";
import { GraphQLError } from "graphql";
import { GraphQLAuthMiddleware } from "../auth/middleware/graphql-auth.middleware";

const userService = UserService.getInstance();
const authMiddleware = GraphQLAuthMiddleware.getInstance();

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: any) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        return await userService.getAllUsers(user);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      try {
        // await authMiddleware.authenticateContext(context);
        return await userService.getUserById(id);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    userByEmail: async (_: any, { email }: { email: string }, context: any) => {
      try {
        await authMiddleware.authenticateContext(context);
        return await userService.getUserByEmail(email);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    templateAnalytics: async (
      _: any,
      { userId, templateName }: { userId: string; templateName: string },
      context: any
    ) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        // Check if the requesting user has permission to view these analytics
        if (user._id.toString() !== userId) {
          throw new GraphQLError('Not authorized to view analytics for this user', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }
        return await userService.getTemplateAnalytics(userId, templateName);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
  },

  Mutation: {
    updateUser: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        // Optional: Check if user has permission to update this user
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to update this user', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }
        return await userService.updateUser(id, input);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    deleteUser: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        // Optional: Check if user has permission to delete this user
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to delete this user', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }
        return await userService.deleteUser(id);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    updateUserTemplate: async (
      _: any,
      { id, template }: { id: string; template: any },
      context: any
    ) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to update this user template', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }

        // Validate logos array if present
        if (template.logos && !Array.isArray(template.logos)) {
          throw new GraphQLError('Logos must be an array', {
            extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } },
          });
        }

        if (template.logos && template.logos.length !== 6) {
          throw new GraphQLError('Logos array must contain exactly 6 items', {
            extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } },
          });
        }

        return await userService.updateUserTemplate(id, template);
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    updateNovaTemplate: async (
      _: any,
      { id, template }: { id: string; template: any },
      context: any
    ) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to update this user template', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }

        return await userService.updateNovaTemplate(id, template);
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    addSelectedTemplate: async (
      _: any,
      { id, templateName }: { id: string; templateName: string },
      context: any
    ) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to add template for this user', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }
        return await userService.addSelectedTemplate(id, templateName);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    removeSelectedTemplate: async (
      _: any,
      { id, templateName }: { id: string; templateName: string },
      context: any
    ) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to remove template for this user', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }
        return await userService.removeSelectedTemplate(id, templateName);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    updateUserPreferences: async (
      _: any,
      {
        id,
        preferences,
      }: { id: string; preferences: { colors: string[]; profession: string } },
      context: any
    ) => {
      try {
        const { user } = await authMiddleware.authenticateContext(context);
        if (user._id.toString() !== id) {
          throw new GraphQLError('Not authorized to update preferences for this user', {
            extensions: { code: 'FORBIDDEN', http: { status: 403 } },
          });
        }
        
        const updatedUser = await userService.updateUserPreferences(id, preferences);
        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
    recordTemplateVisit: async (
      _: any,
      {
        userId,
        templateName,
        visitorData,
      }: {
        userId: string;
        templateName: string;
        visitorData: {
          ip: string;
          country: string;
          browser: string;
          device: string;
        };
      },
      context: any
    ) => {
      try {
        // Note: This mutation might be called from the client-side template page
        // So we may not require authentication here, or we may use a different auth mechanism
        // For now, we'll keep it simple and not require authentication
        
        const result = await userService.recordTemplateVisit(
          userId,
          templateName,
          visitorData as any
        );
        return result;
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },
  },
};
