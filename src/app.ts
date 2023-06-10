import { Client } from "@discord/client";
import OpenAIEmbedding from "@embedding/openai";
import { GatewayIntentBits, Partials } from "discord.js";

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

(async () => {
  try {
    await bot.init();

    const embed = new OpenAIEmbedding();

    const sampleText = "Robots should not be allowed to vote.";
    console.log(await embed.getModeration(sampleText));
    console.log(
      await embed.getModeration(sampleText, "text-moderation-latest")
    );
    console.log(await embed.getEmbedding(sampleText));
  } catch (err) {
    console.error(err);
  }
})();
