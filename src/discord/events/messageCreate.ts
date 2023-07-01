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

      const messagePayload: TEmbedding = {
        embedding: resp.embedding,
        meta: {
          id: message.id,
          original_text: message.content,
          author_id: message.author.id,
          author_name: message.author.username,
          timestamp: message.createdTimestamp,
          link: `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`,
        },
      };
      
      await client.storage.addEmbedding(messagePayload);

      // const embed = new EmbedBuilder()
      //   .setColor("#0099ff")
      //   .setTitle("Embedding")
      //   .setDescription(
      //     `prompt_tokens: ${resp.prompt_tokens}\ntotal_tokens: ${resp.total_tokens}\noriginal_text: ${resp.original_text}`
      //   );

      // await client.send(message.channel, {
      //   embeds: [embed],
      // });
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
