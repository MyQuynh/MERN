import {MikroORM} from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from 'apollo-server-express';
import { HelloResolver } from "./resolvers/hello";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import { MyContext } from "./types";
import connectRedis from "connect-redis";


const main = async () => {

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    // Configuration
    const orm = await MikroORM.init(microConfig);

    // Start execution
    await orm.getMigrator().up();

    const app = express();

    app.use(
        session({
            name:"qid",
            store: new RedisStore({ client: redisClient, disableTouch: true }),
            cookie : {
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                secure: __prod__,
                sameSite: "lax",
            },
            saveUninitialized: false,
            secret: 'dkwdedhkjw',
            resave: false,
        })
        )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req,res}): MyContext => ({em:orm.em, req, res})
    });

    apolloServer.applyMiddleware({app});

    // The first variable is request the second is respond, send the request
    // app.get("/", (_, res) => {
    //     res.send("Hello");
    // });

    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });

    // // Create the instance
    // const post = orm.em.create(Post, {title : "My first post"});
    // This is as the same as const post = new Post("My first pst");

    // await orm.em.persistAndFlush(post); // Adding the new record to database
    // Another way to
    // await orm.em.nativeInsert(Post, {title: "My second project"});

    // Find all the posts in the database
    // const post = await orm.em.find(Post, {});
    // console.log(post);


};

main().catch((err) => {
    console.error(err);
});



