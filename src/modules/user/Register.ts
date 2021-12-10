import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../../entities/User.entity";
import { RegisterInput } from "./Inputs/RegisterInput";
import { sendMail } from "../../utils/sendMail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("data")
    { email, username, phoneno, password }: RegisterInput,
  ): Promise<User> {
    const user = await User.create({
      email,
      username,
      phoneno,
      password,
    }).save();

    sendMail({
      email,
      url: await createConfirmationUrl(user.id as unknown as string),
    });
    return user;
  }
}
