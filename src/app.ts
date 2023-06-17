import { Client } from "@discord/client";
import OpenAIEmbedding, { ModerationModel } from "@embedding/openai";

import DB from "@storage/index";
import { randomUUID } from "crypto";
import { GatewayIntentBits, Partials } from "discord.js";

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

// basic samples from copilot to do basic functionality testing
const SAMPLES = [
  "The essential difficulty in becoming a master rationalist is that you need quite a bit of rationality to bootstrap the learning process",
  "Give me the strength to change the things I can, the grace to accept the things I cannot, and a great big bag of money",
  "Give me the first six months of love, and I'll never ask for anything again",
  "The cosmos is all that is or ever was or ever will be. Our feeblest contemplations of the Cosmos stir us -- there is a tingling in the spine, a catch in the voice, a faint sensation, as if a distant memory, of falling from a height. We know we are approaching the greatest of mysteries.",
  "Opposites Can’t Both Be Right",
  "Wrongly chosen synonyms can dramatically change the meaning of a sentence, and thereby the semantic similarity score.",
  "History can be the only true judge of the past and the present. But future is, definitely, the best judge of the present.",
  "Earth look like a blue apple with a green worm in it",
  "The world is round",
  "Quantum mechanics is a branch of physics that deals with physical phenomena at nanoscopic scales, where the action is on the order of the Planck constant. It departs from classical mechanics primarily at the quantum realm of atomic and subatomic length scales. Quantum mechanics provides a mathematical description of much of the dual particle-like and wave-like behavior and interactions of energy and matter. Quantum mechanics provides a substantially useful framework for many features of the modern periodic table of elements including the behavior of atoms during chemical bonding and has played a significant role in the development of many modern technologies.",
  // some sentences saying the same thing, but with slightly different words
  "Scientists, specially physicists, could be good politicians.",
  "Correctness is a quality, and like most qualities, it has a quantity. Politic is not so exceptional in terms of correctness.",
  "Oceans are large bodies of water that dominate the Earth's surface. They are continuous bodies of salt water that surround the continents and fill the Earth's great depressions. The oceans are the largest of the Earth's water bodies and are all connected to one another. The oceans are the most important of the world's great biomes. Because of their size, they influence the climate of the Earth and play a major role in the biosphere and the water cycle.",
  "Earth is dominated by oceans. Oceans are large bodies of water that surround the continents and fill the Earth's great depressions. The oceans are the largest of the Earth's water bodies and are all connected to one another. The oceans are the most important of the world's great biomes. Because of their size, they influence the climate of the Earth and play a major role in the biosphere and the water cycle.",
  "Earth surface is covered by water. Oceans are large bodies of water that surround the continents and fill the Earth's great depressions. The oceans are the largest of the Earth's water bodies and are all connected to one another. The oceans are the most important of the world's great biomes. Because of their size, they influence the climate of the Earth and play a major role in the biosphere and the water cycle.",
];

(async () => {
  try {
    await bot.init();
    const embed = new OpenAIEmbedding();

    
    const db = new DB();
    await db.init();
    
    const embeddings = await Promise.all(
      SAMPLES.map(async (sample) => embed.getEmbedding(sample))
    );
    
    embeddings.forEach((embedding, index) => {
      db.add({
        embedding: embedding.embedding,
        meta: {
          id: randomUUID(),
          author_id: `${index}`,
          author_name: `author_${index}`,
          original_text: embedding.original_text || "",
        },
      });
    });

    embed
      .getEmbedding("Math brought questions more than answers. Physics is kinda politically correct.")
      .then(({ embedding }) => db.search(embedding))
      .then((res) => console.log('1', res));

    embed
      .getEmbedding("Water is the thing that covers most of the earth. Ocean is the name we give to the water that covers most of the earth.")
      .then(({ embedding }) =>
        db.search(embedding).then((res) => console.log(res))
      );

  } catch (err) {
    console.error("LAST", err);
  }
})();
