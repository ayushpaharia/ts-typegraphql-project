import {
  Entity as TypeOrmEntity,
  Column,
  BeforeInsert,
  Index,
  BeforeUpdate,
} from "typeorm";
import { ObjectType, Field, Root } from "type-graphql";
import Argon2 from "argon2";
import DefaultCoulmnsEntity from "./DefaultColumnEntity";
import { Exclude } from "class-transformer";

@ObjectType()
@TypeOrmEntity("users")
export class User extends DefaultCoulmnsEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @Column({ unique: true })
  @Index()
  email: string;

  @Field()
  @Index((user: User) => [user.email, user.username])
  @Column({ unique: true })
  username: string;

  @Field()
  @Index()
  @Column({ unique: true })
  phoneno: string;

  @Exclude()
  @Column()
  password: string;

  @Field()
  specialID(@Root() user: User): string {
    return `${user.username}#${user.email}`;
  }

  @Column("bool", { default: false })
  confirmed: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await Argon2.hash(this.password);
  }
}
