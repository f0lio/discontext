import { ErrorType, ICommand } from "@discord/structs";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const cmd: ICommand = {
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName("bot-config")
    .setDescription("Gets the bot's current configuration."),
  execute: async (client, interaction): Promise<void> => {
    try {
      // reply with info such as:
      // - channels the bot is authorized to use
      // - roles the bot is authorized to use
      // - etc.
      // const authorizedChannels = client.config.authorizedChannels;
      // const authorizedRoles = client.config.authorizedRoles;
      // const embed = new EmbedBuilder()
      //   .setTitle("Bot Configuration")
      //   .addFields(
      //     {
      //       name: "Authorized Channels",
      //       value: authorizedChannels.length
      //         ? authorizedChannels.map((channel) => `<#${channel}>`).join(", ")
      //         : "None",
      //     },
      //     {
      //       name: "Authorized Roles",
      //       value: authorizedRoles.length
      //         ? authorizedRoles.map((role) => `<@&${role}>`).join(", ")
      //         : "None", 
      //     }
      //   );
      // await client.reply(interaction, {
      //   embeds: [embed],
      //   ephemeral: true,
      // });

    } catch (err) {
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        `Sorry, please try again later.`
      );
    }
  },
};

export default cmd;
