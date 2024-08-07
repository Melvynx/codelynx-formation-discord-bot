//TODO: DELETE ME
//! Je laisse ce fichier pour que Chris ai les infos pour les retranscrire avec sont framework

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

(async () => {
  try {
    console.log('Registering Commands');

    await rest.put(
      Routes.applicationGuildCommands('877636097394475019', env.SERVER_ID),
      { body: commands },
    );

    console.log('Successfully registering commands');
  } catch (e) {
    console.error(e);
  }
})();
