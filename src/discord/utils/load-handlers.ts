import config from "@discord/config";
import { ICommand, IEvent } from "@discord/structs";
import { ClientEvents } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

type TEvent = IEvent<keyof ClientEvents>;

export interface IHandler<T = ICommand> {
  handler: T;
  filePath: string;
}

/**
 * Functions to load commands and events from a folder. (excluding ones marked as devOnly in production)
 * @param folderPath The path to the folder containing the commands or events.
 * @returns {Promise<IHandler[]>} An array of events or commands and their file paths
 * @example
 * const commands = await loadCommands("./commands");
 * commands.forEach((command) => {
 *   client.commands.set(command.data.name, command);
 * });
 */

export const loadCommands = async (folderPath: string): Promise<IHandler[]> => {
  const commands: IHandler[] = [];

  const commandFolders = readdirSync(folderPath);
  for (const folder of commandFolders) {
    const commandsPath = join(folderPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith(".ts") || file.endsWith(".js")
    );
    console.log(`[INFO] Loading ${commandFiles.length} command(s) from ${commandsPath}`);
    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      try {
        const command = (await import(filePath)).default;
        if (command.devOnly && config.isProduction) continue;
        commands.push({
          filePath,
          handler: command,
        });
      } catch (error) {
        console.log(`[WARNING] The command at ${filePath} failed to load.`);
        console.log(error);
      }
    }
  }
  return commands;
};

export const loadEvents = async (
  folderPath: string
): Promise<IHandler<TEvent>[]> => {
  const events: IHandler<TEvent>[] = [];

  const eventFiles = readdirSync(folderPath).filter((file) =>
    file.endsWith(".ts") || file.endsWith(".js")
  );
  for (const file of eventFiles) {
    const filePath = join(folderPath, file);
    try {
      const event = (await import(filePath)).default;
      if (event.devOnly && config.isProduction) continue;
      events.push({
        filePath,
        handler: event,
      });
    } catch (error) {
      console.log(`[WARNING] The event at ${filePath} failed to load.`);
      console.log(error);
    }
  }
  return events;
};
