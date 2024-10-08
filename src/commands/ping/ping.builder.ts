import { SlashCmdBuilder } from "arcscord";

export const pingSlashBuilder = new SlashCmdBuilder()
  .setName("ping")
  .setDescription("Ping pong");
