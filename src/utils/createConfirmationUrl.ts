import { v4 } from "uuid";
import { confirmUserPrefix } from "../modules/constants/redisPrefixes";
import { redis } from "../redis";

export const createConfirmationUrl = async (userId: string) => {
  const id = v4();
  await redis.set(confirmUserPrefix + id, userId, "ex", 60 * 60 * 24);

  console.log({ RedisId: id });
  return `http://localhost:3000/user/confirm/${id}`;
};
