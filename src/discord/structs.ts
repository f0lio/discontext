import {
  BaseInteraction,
  ClientEvents,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
} from "discord.js";

import { Client } from "@discord/client";
import { EmbeddingResponse } from "@embedding/abstract.embedding";
import { QueryStatus, TEmbedding, TSearchResult } from "@storage/storage.abstract";

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

export interface IEmbedEngine {
  getEmbedding: (text: string) => Promise<EmbeddingResponse>;
}

export interface IStorageEngine {
  addEmbedding: (embedding: TEmbedding) => Promise<QueryStatus>;
  searchEmbedding: (vector: number[], limit?: number) => Promise<TSearchResult[]>;
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
