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
  .addSubcommand(sub => sub.setName("tombola").setDescription("Fait un tirage au sort de 3 personnes qui ont eu des tickets"))
  .addSubcommand(sub => sub.setName("add-algos").setDescription("Permet d'ajouter ou supprimer des algos").addStringOption(option => option.setName("algo-name").setDescription("Nom de l'algo").setRequired(true)).addStringOption(opt => opt.setName("link").setDescription("Lien de l'algo").setRequired(true)).addStringOption(opt => opt.setName("schedule-time").setDescription("Date de l'algo").setRequired(true)),
  );
