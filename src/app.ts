import { Client } from "@discord/client";
import { GatewayIntentBits, Partials } from "discord.js";

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

(async () => {
  try {
    await bot.init();
  } catch (err) {
    console.error(err);
  }
})();
