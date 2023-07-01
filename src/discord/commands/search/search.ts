import { ErrorMessages, ErrorType, ICommand } from "@discord/structs";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const cmd: ICommand = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search messages contextually.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query to search for.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to search for.")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "The channel to search in. (Defaults to all authorized channels.)"
        )
    ),
  execute: async (client, interaction): Promise<void> => {
    try {
      const user = interaction.options.get("user")?.user;
      const channel = interaction.options.get("channel")?.channel;
      let description = "Searching";
      let scope = "all authorized channels";
      if (user) {
        description += ` for messages by ${
          user?.username
        }`;
        scope += ` by ${user?.username}`;
      }
      if (channel) {
        description += ` in ${
          channel?.name
        }`;
      } else {
        description += " in all authorized channels";
      }

      const query = interaction.options.getString("query") ?? "";

      const embed = new EmbedBuilder().setDescription(description);

      await client.reply(interaction, {
        embeds: [embed],
        ephemeral: true,
      });

      const resp = await client.embedEngine.getEmbedding(query);
      const results = await client.storage.search(
        resp.embedding,
        3
      );

      if (results.length === 0) {
        await client.editReply(interaction, {
          embeds: [new EmbedBuilder().setDescription("Found none.")],
        });
      } else {
        await client.editReply(interaction, {
          embeds: [new EmbedBuilder().setDescription(
            `
            query: ${query}
            scope: ${scope}
            results_count: ${results.length}
            ------
            ${results.map(r => r.meta?.original_text).join('\n---\n')}
            `
          )],
        });
      }
    } catch (err) {
      console.log({err})
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        ErrorMessages.CommandFailure
      );
    }
  },
};

export default cmd;
