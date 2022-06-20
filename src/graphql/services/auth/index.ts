import { UserDoc } from "../../../models/auth/types";
import { db } from "../../../db";
import { QueryConfig } from "../../../types/db";
import ClientResponse from "../../../utils/response";

export default class AuthService {
  static async createUser(data: UserDoc) {
    try {
      const query: QueryConfig = {
        text: `INSERT INTO user_account(username, email, password) VALUES($1, $2, $3) RETURNING *`,
        values: [data?.username, data?.email, data?.password],
      };

      const result = await db.query(query);
      console.log(result?.rows?.[0]);

      return new ClientResponse(
        201,
        true,
        "Register successfully",
        result?.rows?.[0]
      );
    } catch (err: any) {
      return new ClientResponse(
        400,
        false,
        "Couldn't register user",
        err.message
      );
    }
  }
}
