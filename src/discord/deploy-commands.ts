import config from "@discord/config";
import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { join } from "node:path";
import { loadCommands } from "./utils/load-handlers";

(async () => {
  try {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    const foldersPath = join(__dirname, "commands");

    console.log(`Started loading commands from ${foldersPath}`);
    const handlers = await loadCommands(foldersPath);

    for (const handler of handlers) {
      if ("data" in handler.handler && "execute" in handler.handler) {
        try {
          // @ts-ignore
          const serialized = handler.handler.data.toJSON();
          commands.push(serialized);
        } catch (error) {
          console.log(
            `[WARNING] The command at ${handler.filePath} failed to load as a JSON object.`
          );
        }
      } else {
        console.log(
          `[WARNING] The command at ${handler.filePath} is missing a required "data" or "execute" property.`
        );
      }
    }

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const rest = new REST().setToken(config.botToken);
    const data = await rest.put(
      config.isProduction
        ? Routes.applicationCommands(config.clientId)
        : Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );
    if (data instanceof Array) {
      console.log(
        `Successfully reloaded ${(data as any).length} application (/) commands.`
      );
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
})();
