import { logger } from "../../middlewares/logger";
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../../entities/User.entity";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { MyContext } from "../../types/MyContext";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async findUsers(): Promise<User[] | null> {
    const users: User[] | null = await User.find();

    return users;
  }

  @UseMiddleware(isAuthenticated, logger)
  @Query(() => User, { nullable: true })
  async myProfile(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    const user = await User.findOne({ where: { id: ctx.req.session!.userId } });
    return user;
  }
}
