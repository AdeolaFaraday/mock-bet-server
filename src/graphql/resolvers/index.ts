import GraphQLJSON from "graphql-type-json";
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { authMutations } from "./auth";

const resolvers = {
  JSON: GraphQLJSON,
//   Upload: GraphQLUpload,
  ResponseData: {
    __resolveType(obj: any, _: any, __: any) {
      // console.log({ obj });
      if (obj.searchResultType) {
        return "SearchBrandsUsersEventsResponse";
      }
      return null;
    },
  },
  Query: {},
  Mutation: {
    ...authMutations,
  },
};

export default resolvers;
