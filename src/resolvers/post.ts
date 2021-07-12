import { Post } from "../entities/Post";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "src/types";


@Resolver()
export class PostResolver {

    //([Post] == array of post) 
    // Get list of posts
    // Promise help to notify if the resolve variable is success 
    @Query(()=> [Post])
    posts( @Ctx() {em}: MyContext): Promise<Post[]> {
        // @Ctx: Passing the context which is database connection to the resolver
        return em.find(Post, {});
    }

    //(Post == type of the post) 
    // Get list of that match the id
    // () => Post: return the post type
    @Query(()=> Post, {nullable: true})
    post(   @Ctx() {em}: MyContext,
            // Require the variable when execute this query
            @Arg("id") id:number
    ): Promise<Post|null>{
        // @Ctx: Passing the context which is database connection to the resolver
        return em.findOne(Post, {id});
    }

    @Mutation(() => Post)
    async createPost ( @Ctx() {em} : MyContext,
                @Arg("title") title: string
    ): Promise<Post>{
        const post = em.create(Post,{title});
        await em.persistAndFlush(post);
        return post;
    }
    @Mutation(() => Post)
    async updatePost ( @Ctx() {em} : MyContext,
                @Arg("id") id: number,
                @Arg("title") updateTitle: string
    ): Promise<Post | null> {
        const post = await em.findOne(Post,{id});
        if (!post){
            return null;
        }

        if (updateTitle !== "undefined"){
            post.title = updateTitle;
            em.persistAndFlush(post);
            // For the update since it can be also create a new post too but since it have the same id it
            // It will understand as update
        }
       
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost ( @Ctx() {em} : MyContext,
                @Arg("id") id: number
    ): Promise<Boolean> {
        // const post = await em.findOne(Post,{id});
        // if (post!){
        //     return false;
        // }
        await em.nativeDelete(Post, {id});
        return true;

    }

    // Query is for getting the data from
    // Mutation is for update, delete, create data
}