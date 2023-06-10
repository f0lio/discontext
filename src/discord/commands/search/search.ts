import { ErrorMessages, ErrorType, ICommand } from "@discord/structs";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const cmd: ICommand = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search messages contextually.")
    // .addStringOption((option) =>
    //   option
    //     .setName("query")
    //     .setDescription("The query to search for.")
    //     .setRequired(true)
    // )
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
      let description = "Searching";
      if (interaction.options.get("user")) {
        description += ` for messages by ${
          interaction.options.get("user")?.user?.username
        }`;
      }
      if (interaction.options.get("channel")) {
        description += ` in ${
          interaction.options.get("channel")?.channel?.name
        }`;
      } else {
        description += " in all authorized channels";
      }

      const embed = new EmbedBuilder()
        .setDescription(description);

      await client.reply(interaction, {
        embeds: [embed],
        ephemeral: true,
      });

      await client.editReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription("Found none."),
        ],
      });
    } catch (err) {
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        ErrorMessages.CommandFailure
      );
    }
  },
};

export default cmd;
