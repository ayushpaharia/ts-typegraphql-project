import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../../entities/User.entity";
import { redis } from "../../redis";
import { MyContext } from "../../types/MyContext";
import { changePasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./Inputs/ChangePasswordInput";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const userId = await redis.get(changePasswordPrefix + token);
    if (!userId) {
      return null;
    }
    const user = await User.findOne(userId)!;
    if (!user) {
      return null;
    }
    await redis.del(changePasswordPrefix + token);
    user.password = password;
    user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}
