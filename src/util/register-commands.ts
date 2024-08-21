import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  REST,
  Routes,
} from 'discord.js';
import { env } from './env';

export const commands = [
  new ContextMenuCommandBuilder()
    .setName('Marquer comme solution')
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false),
];
const rest = new REST().setToken(env.TOKEN);

export const registerCommands = async () => {
  try {
    console.log('Registering Commands...');

    await rest.put(
      Routes.applicationGuildCommands(env.APPLICATION_ID, env.SERVER_ID),
      { body: commands },
    );

    console.log('Successfully registering commands');
  } catch (e) {
    console.error('Error occurred when registering commands');
    console.error(e);
  }
};
