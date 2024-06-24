import knex from "knex";

import { knex_connection } from "./mysql.js";

const connectionDatabase = knex(knex_connection);

export default connectionDatabase;
