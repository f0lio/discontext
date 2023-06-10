import config from "@discord/config";
import { ErrorType, ICommand } from "@discord/structs";
import { loadCommands, loadEvents } from "@discord/utils/load-handlers";
import {
  BaseGuildTextChannel,
  Collection,
  Client as DiscordClient,
  EmbedBuilder,
  PermissionFlagsBits,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type ClientOptions,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
  type InteractionResponse,
  type Message,
  type MessagePayload,
  type StringSelectMenuInteraction,
  type TextBasedChannel
} from "discord.js";
import { basename, join } from "path";

export class Client<
  Ready extends boolean = boolean
>
extends DiscordClient<Ready> {
  readonly #botToken= config.botToken

  public commands: Collection<string, ICommand> = new Collection();

  public constructor(options: ClientOptions) {
    super(options);
  }

  async #registerEvents(): Promise<void> {
    const events = await loadEvents(join(__dirname, "events"));
    for (const event of events) {
      this.on(event.handler.event, (...args) =>
        event.handler.execute(this, ...args)
      );
    }
    console.log(`Registered ${events.length} event(s)`);
  }

  async #registerCommands(): Promise<void> {
    const commands = await loadCommands(join(__dirname, "commands"));
    for (const command of commands) {
      const name = command.handler.data.name;
      if (name) {
        this.commands.set(name, command.handler);
      } else
        console.log(
          `[WARNING] Command name not set: ${basename(command.filePath)}`
        );
    }
    console.log(`Registered ${this.commands.size} command(s)`);
  }

  #isAllowed(channel: TextBasedChannel): boolean {
    if (
      channel instanceof BaseGuildTextChannel &&
      (!channel.guild.members.me ||
        !channel.viewable ||
        !channel
          .permissionsFor(channel.guild.members.me)
          .has(
            PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages
          ))
    )
      return false;
    return true;
  }

  public async reply(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | StringSelectMenuInteraction,
    options: string | MessagePayload | InteractionReplyOptions
  ): Promise<Message | InteractionResponse | undefined> {
    const { channel } = interaction;
    if (interaction.inCachedGuild() && channel && !this.#isAllowed(channel))
      return;
    return interaction.reply(options);
  }

  public async editReply(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | StringSelectMenuInteraction,
    options: string | MessagePayload | InteractionEditReplyOptions
  ): Promise<Message | undefined> {
    const { channel } = interaction;
    if (interaction.inCachedGuild() && channel && !this.#isAllowed(channel))
      return;
    return interaction.editReply(options);
  }

  // Unified error reply
  public async replyWithError(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | StringSelectMenuInteraction,
    type: ErrorType,
    message: string
  ): Promise<void> {
    if (!this.isReady()) return;
    await this.reply(interaction, {
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
        .setColor("Red")
          .setAuthor({
            name: this.user.tag,
            iconURL: this.user.displayAvatarURL(),
          })
          .setTitle(`Error: \`${type}\``)
          .setDescription(message)
      ],
    });
  }

  public async init(): Promise<void> {
    await this.#registerEvents();
    await this.#registerCommands();
    await this.login(this.#botToken);
  }
}
