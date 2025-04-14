import { AuthService } from "./auth.service";
import { formatError } from "../../lib/utils/error.utils";
import { GraphQLError } from "graphql";
import { LoginInput, RegisterInput } from "./types/auth.types";

const authService = AuthService.getInstance();

export const authResolvers = {
  Mutation: {
    register: async (_: any, { input }: { input: RegisterInput }) => {
      try {
        return await authService.register(input);
      } catch (error) {
        const formattedError = formatError(error);
        throw new GraphQLError(JSON.stringify(formattedError), {
          extensions: { http: formattedError },
        });
      }
    },

    login: async (_: any, { input }: { input: LoginInput }) => {
      return authService.login(input.email, input.password);
    },

    requestPasswordReset: async (_: any, { email }: { email: string }) => {
      await authService.generatePasswordResetToken(email);
      return true;
    },

    resetPassword: async (_: any, { token, newPassword }: { token: string; newPassword: string }) => {
      await authService.resetPassword(token, newPassword);
      return true;
    },
  },
};
