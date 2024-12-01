import { SlashCmdBuilder } from "arcscord";

export const verifyBuilder = new SlashCmdBuilder()
  .setName("verify")
  .setDescription("Verify your account")
  .setDMPermission(false)
  .addStringOption(option => option
    .setName("email")
    .setRequired(true)
    .setDescription("Your CODELINE email"));
