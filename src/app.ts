import { Client } from "@discord/client";
import OpenAIEmbedding from "@embedding/openai";

import DB from "@storage/index";

import { GatewayIntentBits, Partials } from "discord.js";

(async () => {
  try {
    const embed = new OpenAIEmbedding();
    const db = new DB();
    await db.init();
    const bot = new Client(
      {
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel],
      },
      embed,
      db
    );

    await bot.init();
  } catch (err) {
    console.error(err);
  }
})();
