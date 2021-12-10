import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";
import { User } from "../../entities/User.entity";
import { redis } from "../../redis";
import { sendMail } from "../../utils/sendMail";
import { changePasswordPrefix } from "../constants/redisPrefixes";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(changePasswordPrefix + token, user.id, "ex", 60 * 60 * 24);

    console.log({ RedisToken: token });
    await sendMail({
      email,
      url: `http://localhost:3000/user/change-password/${token}`,
    });

    return true;
  }
}
