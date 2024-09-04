import { Snowflake } from "@sapphire/snowflake";

const epoch = new Date("2024-07-01T00:00:00.000Z");
const snowflake = new Snowflake(epoch);

export const generateId = (): string => {
  return snowflake.generate().toString();
};