import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../../entities/User.entity";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<Boolean> {
    const userId = await redis.get(confirmUserPrefix + token);
    if (!userId) return false;

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    redis.del(confirmUserPrefix + token);

    return true;
  }
}
