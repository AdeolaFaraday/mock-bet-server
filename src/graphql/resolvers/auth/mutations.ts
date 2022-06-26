import { UserDoc } from "@app/models/auth/types";
import ClientResponse from "../../../utils/response";
import AuthService from "../../services/auth";

const authMutations = {
  createUser: async (_: any, args: { args: UserDoc }, context: any) => {
    return await AuthService.createUser(args.args);
  },
  login: async (_: any, args: { args: UserDoc }, context: any) => {
    try {
      // console.log('This is the actual context object ->', context);
      // console.log(
      //   'Checking if the context object has req in it ->',
      //   context.req
      // );
      const { user } = await context.authenticate("graphql-local", {
        email: args.args.email,
        password: args.args.password,
      });

      context.login(user);
      return new ClientResponse(200, true, "successful login", user);
    } catch (error: any) {
      return new ClientResponse(401, false, error.message, null);
    }
  },
};

export default authMutations;
