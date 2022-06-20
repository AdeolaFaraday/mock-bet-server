import passport from "passport";
import bcrypt from "bcryptjs";
import { UserDoc } from "../models/auth/types";
import { db } from "../db";
import { QueryConfig } from "../types/db";

type CallbackFn<T> = (err?: Error | null, ret?: T) => void;

const verifyFn = async (
  email: string,
  password: string,
  done: CallbackFn<UserDoc | null>
): Promise<void> => {
  const query: QueryConfig = {
    text: `SELECT * FROM user_account WHERE username = $1 AND password = $2`,
    values: [email, password],
  };

  const matchingUser = await db.query(query);

  console.log({ matchingUser });

  if (!matchingUser) {
    const error = new Error("no matching user");
    done(error, null);
  } else if (!matchingUser.password || matchingUser.password === undefined) {
    const error = new Error(
      "This account was probably created through one of the supported social logins. Make sure you sign in through the channel this account was created through"
    );
    done(error, null);
  } else {
    const reframedPassword: any = password;
    try {
      // This means the user logged in through socials and
      // has already been validated
      // I don't know why develop keeps overwriting
      if (JSON.parse(reframedPassword).isValidated) {
        done(null, matchingUser);
      } else {
        const isMatch = await bcrypt.compare(
          password as string,
          matchingUser.password
        );
        const error = isMatch ? null : new Error("No matching user");
        done(error, matchingUser);
      }
    } catch (e: any) {
      // Catch will execute if JSON.parse(throws an error)
      // This means the passowrd was never JSON parsed
      const isMatch = await bcrypt.compare(
        password as string,
        matchingUser.password
      );
      const error = isMatch ? null : new Error("No matching user");
      done(error, matchingUser);
    }
  }
};
