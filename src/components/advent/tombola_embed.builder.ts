import { EmbedBuilder } from "discord.js";
import type { tombolaEmbedPropsSchema } from "./tombolaEmbedProps.type";

export const adventResultEmbedBuilder = ({
  firstReward,
  moreMessage,
  moreTicket,
  participants,
  quickTime,
  secondReward,
  thirdReward,
}: tombolaEmbedPropsSchema) => new EmbedBuilder()
  .setAuthor({
    name: "Codelynx Bot",
    iconURL:
        "https://cdn.discordapp.com/avatars/1252945949014097972/725f42cdff5387b33a108703945f16f2.webp",
  })
  .setTitle("The Advent Calendar Challenge of Codeline")
  .setURL("https://example.com")
  .addFields(
    {
      name: "C'est l'heur du reveal !!!",
      value: `Bonjour à tous @everyone ! L'heure du verdict arrive enfin !
Certains d'entre vous participent à ce challenge depuis maintenant 25 jours pour obtenir des précieux tickets・🎟️
Le tirage au sort arrive dans quelques instants ! Mais avant, voyons la liste et le nombre de tickets des participants !
`,
      inline: false,
    },
    {
      name: "Les participants",
      value: `${participants
        .map(p => `<@${p.userId}> - ${p.ticketCount}・🎟️`)
        .join("\n")}\n\nUn grand bravo à tous ces participants !\n_\n_`,
      inline: false,
    },
    {
      name: "Prix spéciaux",
      value:
          "Avant de vous dévoiler les résultats, nous avons décidé de vous proposer quelques prix spéciaux pour vous récompenser de votre participation.",
      inline: false,
    },
    {
      name: "Le plus de tickets・🎟️",
      value: `Bravo à <@${moreTicket.userId}> pour avoir remporté un total de ${moreTicket.ticketCount} tickets・🎟️`,
      inline: true,
    },
    {
      name: "Le plus de messages",
      value: `Mention spéciale à <@${moreMessage.userId}> qui s'est montré très actif durant ce challenge avec ${moreMessage.messageCount} messages envoyés dans les salons du challenge`,
      inline: true,
    },
    {
      name: "Le plus rapide",
      value: `Bravo à <@${quickTime.userId}> qui a été le plus rapide et a su donner une solution valide en seulement ${quickTime.responseTime}`,
      inline: true,
    },
    {
      name: "Tout le monde",
      value: `Bravo à tous les participants de l'Advent Challenge of Codeline.
Pour vous remercier, voici un rôle <@&1289662437745754226> qui vous permet d'avoir la classe !

`,
      inline: true,
    },
    {
      name: "Les résultat !",
      value:
          "Bon, cette fois, je crois que vous avez suffisamment attendu. Voici nos 3 heureux élus.",
      inline: false,
    },
    {
      name: "GAIN 1",
      value: `<@${firstReward.userId}>`,
      inline: true,
    },
    {
      name: "GAIN 2",
      value: `<@${secondReward.userId}>`,
      inline: true,
    },
    {
      name: "GAIN 3",
      value: `<@${thirdReward.userId}>`,
      inline: true,
    },
    {
      name: "Récupération des prix",
      value:
          "*Un membre du staff va bientôt prendre contact avec vous pour vous remettre vos prix.*",
      inline: false,
    }
  )
  .setColor("#00b0f4")
  .setFooter({
    text: "Codelynx Bot",
    iconURL:
        "https://cdn.discordapp.com/avatars/1252945949014097972/725f42cdff5387b33a108703945f16f2.webp",
  })
  .setTimestamp();