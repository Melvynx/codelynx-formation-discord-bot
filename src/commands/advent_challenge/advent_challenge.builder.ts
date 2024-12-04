import { SlashCmdBuilder } from "arcscord";

export const adventCommandBuilder = new SlashCmdBuilder()
  .setName("advent")
  .setDescription("Advents challenge commands")
  .setDefaultMemberPermissions("Administrator")
  .addSubcommand(sub => sub
    .setName("scores")
    .setDescription(
      "Fournis le score des tickets obtenus par les participants",
    ))
  .addSubcommand(sub => sub.setName("tombola").setDescription("Fait un tirage au sort de 3 personnes qui ont eu des tickets"));
