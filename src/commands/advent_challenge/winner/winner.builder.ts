import { MessageCommandBuilder } from "arcscord";

export const adventWinnerMessageBuilder = new MessageCommandBuilder()
  .setName("Gagnant du jour de l'algo")
  .setDMPermission(false);
