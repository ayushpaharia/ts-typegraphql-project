import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import Argon2 from "argon2";

import { User } from "../../entities/User.entity";
import { MyContext } from "../../types/MyContext";
import { LoginInput } from "./Inputs/LoginInput";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("data") { emailUsernamePhoneno, password }: LoginInput,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const user = await User.findOne({
      where: [
        { email: emailUsernamePhoneno },
        { username: emailUsernamePhoneno },
        { phoneno: emailUsernamePhoneno },
      ],
    });

    if (!user) return null;

    if (!(await Argon2.verify(user.password, password))) {
      return null;
    }
    if (!user.confirmed) {
      throw new Error("User not confirmed");
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
