import { UserDoc } from "@app/models/auth/types";
import AuthService from "../../services/auth";

const authMutations = {
  createUser: async (_: any, args: { args: UserDoc }, context: any) => {
    return await AuthService.createUser(args.args);
  },
};

export default authMutations;
