import { UserDoc } from "../../../models/auth/types";
import { db } from "../../../db";
import { QueryConfig } from "../../../types/db";
import ClientResponse from "../../../utils/response";

export default class AuthService {
  static async createUser(data: UserDoc) {
    try {
      const queryUser: QueryConfig = {
        text: `SELECT * FROM user_account WHERE email = $1 OR username = $2`,
        values: [data.email, data.username],
      };

      const matchingUser = await db.query(queryUser);
      if (matchingUser?.rows?.[0]) {
        throw new Error("User with this email or username already exist");
      }
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
      return new ClientResponse(400, false, err.message, null);
    }
  }
}
