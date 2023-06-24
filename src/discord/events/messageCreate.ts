import { IEvent } from "@discord/structs";
import { TEmbedding } from "@storage/storage.abstract";
import { EmbedBuilder, Events } from "discord.js";

const event: IEvent<typeof Events.MessageCreate> = {
  event: Events.MessageCreate,
  execute: async (client, message) => {
    if (!client.isReady()) return;
    if (message.author.bot) return;
    if (message.author.id === client.user?.id) return;
    try {
      const resp = await client.embedEngine.getEmbedding(message.content);

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Embedding")
        .setDescription(
          `prompt_tokens: ${resp.prompt_tokens}\ntotal_tokens: ${resp.total_tokens}\noriginal_text: ${resp.original_text}`
        );

      await client.send(message.channel, {
        embeds: [embed],
      });
    } catch (err) {
      console.log("catch");
      if (err instanceof Error) {
        console.error(err.stack);
        console.log("here");
      } else console.error(err);
    }
  },
};

export default event;
