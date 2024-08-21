import { SlashCmdBuilder } from "arcscord";

export const adminCommandBuilder = new SlashCmdBuilder()
  .setName("admin")
  .setDescription("Administrator command")
  .setDefaultMemberPermissions("Administrator")
  .addSubcommandGroup((group) => group
    .setName("setup")
    .setDescription("setups commands")
    .addSubcommand((sub) => sub
      .setName("verify")
      .setDescription("Setup verif message")));