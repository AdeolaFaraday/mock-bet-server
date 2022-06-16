const authMutations = {
  hello: async (_: any, args: any, context: any) => {
    try {
      return "hello";
    } catch (e: any) {
      return e.message;
    }
  },
};

export default authMutations;
