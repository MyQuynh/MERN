import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";

// Tell TypeScript which variable is accept while passing it to MikroORM.init
export default {
    entities: [Post],
    dbName: 'lireddit',
    password: 'ngomyquynh',
    type: 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
    debug:  !__prod__,
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    }
} as Parameters<typeof MikroORM.init>[0];