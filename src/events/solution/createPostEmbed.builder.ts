import { EmbedBuilder } from "discord.js";

export function createPostEmbedBuilder() {
  return new EmbedBuilder().setTitle("Post crée !").setDescription(
    ":white_check_mark: Une fois le post résolu, vous pouvez marquer le message qui vous a aidé avec : `clic droit -> Applications -> Marquer comme solution.`",
  ).setColor("#5865f2").setImage(
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXRzOXowMjF3c3IzNnJtc2RrcDB4a3J2YTdjNnp1MzNmMDhmY2Q5dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gj1ZajxelyQtMQc4ar/giphy.gif",
  );
}
