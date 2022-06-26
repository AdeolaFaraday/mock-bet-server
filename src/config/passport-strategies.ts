import bcrypt from "bcryptjs";
import { UserDoc } from "../models/auth/types";
import { db } from "../db";
import { QueryConfig } from "../types/db";
import passport from "passport";

type CallbackFn<T> = (err?: Error | null, ret?: T) => void;

declare global {
  namespace Express {
    interface User {
      user_id?: number;
    }
  }
}

passport.serializeUser((user: Express.User, done) => {
  return done(null, user.user_id);
});

passport.deserializeUser((id: string, done) => {
  const query: QueryConfig = {
    text: `SELECT * FROM user_account WHERE user_id = $1`,
    values: [id],
  };
  db.query(query).then((result: any) => {
    return done(null, result?.rows?.[0]);
  });
});

export const verifyFn = async (
  email: unknown,
  password: unknown,
  done: CallbackFn<UserDoc | null>
): Promise<void> => {
  const query: QueryConfig = {
    text: `SELECT * FROM user_account WHERE email = $1`,
    values: [email as string],
  };

  const matchingUser = await db.query(query);

  const userObject = matchingUser?.rows?.[0];

  if (!userObject) {
    const error = new Error("no matching user");
    done(error, null);
  } else if (!userObject.password || userObject.password === undefined) {
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
        done(null, userObject);
      } else {
        const isMatch = await bcrypt.compare(
          password as string,
          userObject.password
        );

        const error = isMatch ? null : new Error("No matching user");
        done(error, userObject);
      }
    } catch (e: any) {
      // Catch will execute if JSON.parse(throws an error)
      // This means the passowrd was never JSON parsed
      const isMatch = await bcrypt.compare(
        password as string,
        userObject.password
      );
      const error = isMatch ? null : new Error("No matching user");
      done(error, userObject);
    }
  }
};
