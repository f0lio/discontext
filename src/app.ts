import { Client } from "@discord/client";
import OpenAIEmbedding, { ModerationModel } from "@embedding/openai";
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
    console.log(
      (await embed.getModeration(sampleText, ModerationModel.LATEST)).results
    );
    console.log(
      (await embed.getModeration(sampleText, ModerationModel.STABLE)).results
    );
    console.log(await embed.getEmbedding(sampleText));
  } catch (err) {
    console.error(err);
  }
})();
