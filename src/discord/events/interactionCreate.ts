import config from "@discord/config";
import { ErrorMessages, ErrorType, IEvent } from "@discord/structs";
import {
  Events
} from "discord.js";

const event: IEvent<typeof Events.InteractionCreate> = {
  event: Events.InteractionCreate,
  execute: async (client, interaction) => {
    if (!client.isReady()) return;

    if (interaction.isChatInputCommand()) {

      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        if (command.devOnly && !config.isProduction) {
          console.log(
            `[INFO] ${interaction.user.tag} tried to run a devOnly command [/${command.data.name}]`
          );  
          await client.replyWithError(
            interaction,
            ErrorType.CommandUnavailable,
            ErrorMessages.CommandUnavailable
          );
          return;
        };
        await command.execute(client, interaction);
      } catch (err) {
        if (err instanceof Error) console.error(err.stack);
        else console.error(err);
      }
    }
  },
}

export default event;
