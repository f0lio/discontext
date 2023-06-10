import { ErrorType, ICommand } from "@discord/structs";
import { SlashCommandBuilder } from "discord.js";

const cmd: ICommand = {
  data: new SlashCommandBuilder()
    .setName("yo")
    .setDescription("Replies with yoooooo!!"),
  execute: async (client, interaction): Promise<void> => {
    try {
      await client.reply(interaction, {
        content: "yoooooo!!",
        ephemeral: true,
      });
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
