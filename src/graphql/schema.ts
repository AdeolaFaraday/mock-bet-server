import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import { makeExecutableSchema } from "@graphql-tools/schema";

import resolvers from "./resolvers";

const typeDefsPath = join(__dirname, "./typedefs");
//const typeDefsPath = 'src/graphql/typedefs';
const gqlFiles = readdirSync(typeDefsPath);

let typeDefs = ``;

gqlFiles.forEach((file) => {
  typeDefs += readFileSync(join(typeDefsPath, file), {
    encoding: "utf8",
  });
});

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
