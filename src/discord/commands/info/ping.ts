import { ICommand } from "@discord/structs";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  User,
} from "discord.js";

const getMember = (
  interaction: ChatInputCommandInteraction
): { member: GuildMember | null; user: User } => {
  const { guild, user } = interaction;
  const member = guild?.members.cache.get(user.id) ?? null;
  return { member, user };
};

const cmd: ICommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gets the bot's current ping."),
  execute: async (client, interaction): Promise<void> => {
    const { user, guild, createdTimestamp } = interaction;
    const { member } = getMember(interaction);

    const embed = new EmbedBuilder()
      .setDescription("`Pinging...`");

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      ephemeral: true,
    });
    const ping = Math.round(interaction.client.ws.ping);
    const apiLatency = Math.round(message.createdTimestamp - createdTimestamp);

    let color: any = Colors.Green
    if (ping + apiLatency > 200) color = Colors.Yellow;
    if (ping + apiLatency > 500) color = Colors.Red;

    embed
      .setTitle(`Pong`)
      .setColor(color)
      .setDescription(null)
      .addFields(
        { name: "Ping", value: `${ping}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      )
    await interaction.editReply({ embeds: [embed] });
  },
};

export default cmd;