import { Length, IsEmail, IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Index } from "typeorm";

import { DoesEmailAlreadyExist } from "../helpers/isEmailAlreadyExist";
import { PasswordMixin } from "../shared/PasswordMixin";

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @IsNotEmpty({ message: "Must be a valid email property" })
  @IsEmail({}, { message: "Must be a valid email" })
  @DoesEmailAlreadyExist({ message: "Email already exists" })
  email: string;

  @Field()
  @Index()
  @IsNotEmpty({ message: "Must have an username property" })
  @Length(3, 255, {
    message: "Username is too short - should be 3 characters or longer",
  })
  username: string;

  @Field()
  @Index()
  @IsNotEmpty({ message: "Must have an phoneno property" })
  @Length(10, 10, {
    message: "Phone number is invalid",
  })
  phoneno: string;
}
