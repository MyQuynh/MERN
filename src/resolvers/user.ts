import * as argon2 from "argon2";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";

@InputType()
class UserNew {
    @Field(() => String)
    username: string;

    @Field(() => String)
    password: string;
}

@ObjectType()
class Error {
    @Field(() => String)
    field: string;

    @Field(() => String)
    message: string;
}

@ObjectType()
class UserRespond {
    @Field(() => [Error], {nullable: true})
    error?: Error[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver {

    @Query(()=> User)
    async me (
        @Ctx() {em, req} : MyContext,
    ): Promise<User | null>{
        if(!req.session.userId){
            return null;
        }
        const user = await em.findOne(User, {id : req.session.userId});
        return user;
    } 

    @Mutation(()=> User)
    async createUser(
        @Ctx() {em} : MyContext,
        @Arg("userInfo") newUser: UserNew
    ): Promise<User>{
        const hashPassword = await argon2.hash(newUser.password);
        const user = em.create(User, {username: newUser.username, password: hashPassword});
        await em.persistAndFlush(user);

        return user;
    };

    @Mutation(()=> UserRespond)
    async login(
        @Ctx() {em, req} : MyContext,
        @Arg("userInfo") newUser: UserNew
    ): Promise<UserRespond>{
        const user = await em.findOne(User, {username: newUser.username});
        if (!user){
            return {
                error: [{
                    field: 'username',
                    message: "Could not find user"
                }]
            };
        }
        const valid = argon2.verify(user.password,newUser.password);
        if (!valid){
            return {
                error: [{
                    field: 'password',
                    message: "Incorrect password"
                }]
            }
        }

        // Session to save for further login
        req.session.userId = user.id;
        return {user,}
    };




}

// Notice:
// The different between ObjectType and InputType is that the InputType is used for pass by as an argument, while ObjectType just can be when return the type of the value