import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";
import { PasswordMixin } from "../shared/PasswordMixin";

@InputType()
export class LoginInput extends PasswordMixin(class {}) {
  @Field()
  @IsNotEmpty({ message: "Email, Username or Phone no. us required " })
  emailUsernamePhoneno: string;
}
