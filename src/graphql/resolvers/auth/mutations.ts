import AuthService from "../../services/auth";

const authMutations = {
  createUser: async (_: any, args: any, context: any) => {
    return await AuthService.createUser(args);
  },
};

export default authMutations;
