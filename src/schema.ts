import { authResolvers } from "./modules/auth";
import { authTypeDefs } from "./modules/auth";

import { userTypeDefs } from "./modules/user";
import { userResolvers } from "./modules/user";

export const typeDefs = [userTypeDefs, authTypeDefs];
export const resolvers = [userResolvers, authResolvers];
