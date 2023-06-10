import {
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  BaseInteraction,
  ClientEvents,
} from "discord.js";

import { Client } from "@discord/client";

type ExecFunction<TInteraction extends BaseInteraction> = (
  client: Client<true>,
  interaction: TInteraction
) => Promise<void> | void;

//   Interfaces
export interface ICommand {
  data: Partial<SlashCommandBuilder>;
  execute: ExecFunction<ChatInputCommandInteraction>;
  devOnly?: boolean;
}

export interface IEvent<K extends keyof ClientEvents> {
  devOnly?: boolean;
  event: K;
  execute: (
    client: Client,
    ...args: ClientEvents[K]
  ) => Promise<void> | void;
}

//   Enums
export enum CommandType {
  Information = "information",
  Miscellaneous = "miscellaneous",
  Search = "search",
}

export enum ErrorType {
  MissingPermissions = "Missing Permissions",
  CommandFailure = "Command Failure",
  CommandUnavailable = "Command Unavailable",
}

export enum ErrorMessages {
  MissingPermissions = "You do not have the required permissions to run this command.",
  CommandFailure = "An error occurred while running this command.",
  CommandUnavailable = "This command is currently unavailable.",
}
