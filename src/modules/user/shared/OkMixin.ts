import { Field, InputType } from "type-graphql";
import { ClassType } from "type-graphql";
export const OkMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class OkInput extends BaseClass {
    @Field()
    ok: boolean;
  }
  return OkInput;
};
