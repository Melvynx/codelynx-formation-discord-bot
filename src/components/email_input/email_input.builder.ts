import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const EMAIL_INPUT_ID = "email_input";
export const EMAIL_INPUT_TEXT_INPUT_ID = "email_input_value";

const textInput = new TextInputBuilder()
  .setCustomId(EMAIL_INPUT_TEXT_INPUT_ID)
  .setLabel("Votre adresse email")
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

const actionRow = new ActionRowBuilder<TextInputBuilder>()
  .addComponents(textInput);

export const emailInputBuilder = new ModalBuilder()
  .setTitle("Vérification par email")
  .setCustomId(EMAIL_INPUT_ID)
  .addComponents(actionRow);