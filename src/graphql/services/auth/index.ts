import ClientResponse from "../../../utils/response";

export default class AuthService {
  static async createUser(args: any) {
    try {
      const userObject: any = null;
      return new ClientResponse(201, true, "Register successfully", userObject);
    } catch (err: any) {
      return new ClientResponse(
        201,
        false,
        "Couldn't register user",
        err.message
      );
    }
  }
}
