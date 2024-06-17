import { Client } from "discord.js";
import { env } from "../util/env";

export const askNewUserEmailModule = async (client: Client) => {
  client.on("guildMemberAdd", async (member) => {
    // send a MP to the user asking for an email
    await member.send(
      "Hello, si tu as rejoins les formations de Melvynx, tu peux m'envoyer ton email afin que je t'ajoutes tous les rôles de formations que tu as rejoints."
    );
  });

  client.on("messageCreate", async (message) => {
    if (message.guildId) {
      return;
    }

    if (message.author.bot) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = message.content.trim();

    if (emailRegex.test(email)) {
      await message.reply("Merci, votre email a été reçu.");
      // Here you can add additional logic to handle the email, e.g., store it in a database

      const result = await fetch(
        `${env.CODELINE_ENDPOINT}/api/v1/users/${email}`,
        {
          headers: {
            Authorization: `Bearer ${env.CODELINE_TOKEN}`,
          },
        }
      ).then((res) => res.json());

      if (!result.user) {
        await message.reply("L'email que tu as reçu n'est pas valide.");
        return;
      }

      if (
        result.user.discordId &&
        result.user.discordId !== message.author.id
      ) {
        await message.reply(
          "L'email que tu as reçu est déjà utilisé par un autre utilisateur."
        );
        return;
      }

      const products = result.user.products as {
        id: string;
        title: string;
        discordRoleId: string;
      }[];

      await message.reply(`Je viens de trouver les formations que tu as rejoints.
      
${products.map((product) => `- ${product.title}`).join("\n")}`);
      try {
        const guild = client.guilds.cache.get(env.SERVER_ID);
        await guild?.roles.fetch();
        await guild?.members.fetch();
        const guildMember = guild?.members.cache.get(message.author.id);

        if (!guildMember) return;

        for (const product of products) {
          if (!product.discordRoleId) continue;

          const role = guild?.roles.cache.find(
            (role) => role.id === product.discordRoleId
          );

          if (!role) continue;

          if (role) {
            await guildMember.roles.add(role);
          }
        }

        // update the user with his discordId
        const updateResult = await fetch(
          `${env.CODELINE_ENDPOINT}/api/v1/users/${email}`,
          {
            headers: {
              Authorization: `Bearer ${env.CODELINE_TOKEN}`,
            },
            method: "PATCH",
            body: JSON.stringify({
              discordId: message.author.id,
            }),
          }
        ).then((res) => res.json());
      } catch (e) {
        console.error(e);
        await message.reply("Une erreur est survenue.");
      }
    } else {
      await message.reply(
        "L'email fourni n'est pas valide. Veuillez réessayer."
      );
    }
  });
};
