import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";
import { PasswordMixin } from "../shared/PasswordMixin";

@InputType()
export class ChangePasswordInput extends PasswordMixin(class {}) {
  @Field()
  @IsNotEmpty({ message: "Must have a token" })
  token: string;
}
