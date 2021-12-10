import { Exclude } from "class-transformer";
import { IsNotEmpty, Length, Matches } from "class-validator";
import { ClassType, Field, InputType } from "type-graphql";

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType({ isAbstract: true })
  class PasswordInput extends BaseClass {
    @Exclude()
    @Field()
    @IsNotEmpty({ message: "Must have an password property" })
    @Length(6, 255, {
      message: "Password is too short - should be 6 characters or longer",
    })
    @Matches(/^[a-zA-Z0-9._-]*$/, {
      message:
        "Password can only contain alphabets, numbers , underscores, periods and dashes",
    })
    @Field()
    password: string;
  }
  return PasswordInput;
};
