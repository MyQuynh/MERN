import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User{

  @Field()
  @PrimaryKey()
  id!: number; // 

  @Field(() => Date)
  @Property({type: "date"})
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String)
  @Property({type: "text", unique: true})
  username!: string;

  @Property({type: "text"})
  password!: string;

}