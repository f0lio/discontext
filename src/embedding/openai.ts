import AEmbedding, {
  EmbeddingResponse,
  TEmbeddingOptions,
} from "@embedding/abstract.embedding";
import config from "@embedding/config";
import { existsSync, readFile, readFileSync, writeFileSync } from "fs";
import { Configuration, CreateModerationResponse, OpenAIApi } from "openai";
import { join } from "path";

export enum EmbeddingModel {
  ADA = "text-embedding-ada-002",
}

export enum ModerationModel {
  LATEST = "text-moderation-latest",
  STABLE = "text-moderation-stable",
}

type TEmbeddingModel = EmbeddingModel.ADA;
type TModerationModel = ModerationModel.LATEST | ModerationModel.STABLE;

class OpenAIEmbedding extends AEmbedding<
  TModerationModel,
  CreateModerationResponse
> {
  readonly #openai: OpenAIApi;
  readonly #configuration: Configuration = new Configuration({
    apiKey: config.openai_api_key,
  });
  readonly #model;
  readonly #moderationModel;

  readonly #CACHE_FILE = "cache.ignore.json";
  readonly #cacheFile; // the readFileSync result

  constructor(
    model: TEmbeddingModel = EmbeddingModel.ADA,
    moderationModel: TModerationModel = ModerationModel.LATEST
  ) {
    super();
    this.#openai = new OpenAIApi(this.#configuration);
    this.#model = model;
    this.#moderationModel = moderationModel;

    if (config.isProd === false) {
      if (existsSync(join(__dirname, this.#CACHE_FILE)) === false) {
        writeFileSync(join(__dirname, this.#CACHE_FILE), "[]");
      }
      this.#cacheFile = readFileSync(
        join(__dirname, this.#CACHE_FILE),
        "utf-8"
      );
    }
  }

  public async getEmbedding(
    text: string,
    options?: TEmbeddingOptions
  ): Promise<EmbeddingResponse> {
    const payload = {
      input: text,
      model: options?.model || this.#model,
      user: options?.user,
    };
    if (!payload.user) {
      delete payload.user;
    }

    // simple cache for dev to avoid hitting the API limit
    const fromCache = await (this as any).getEmbeddingFromCache(payload);
    if (fromCache) {
      console.log("[OpenAI] Using cached embedding for:", text);
      return fromCache;
    }
    const resp = await this.#openai.createEmbedding(payload);
    await (this as any).addEmbeddingToCache({
      ...payload,
      ...resp.data,
    });
    return {
      embedding: resp.data.data[0].embedding,
      model: resp.data.model,
      prompt_tokens: resp.data.usage.prompt_tokens,
      total_tokens: resp.data.usage.total_tokens,
      original_text: text,
    };
  }

  public async getModeration(
    text: string,
    model?: TModerationModel
  ): Promise<CreateModerationResponse> {
    const resp = await this.#openai.createModeration({
      input: text,
      model: model || this.#moderationModel,
    });
    return resp.data;
  }

  public getEmbeddingModel(): string {
    return this.#model;
  }

  public getModerationModel(): string {
    return this.#moderationModel;
  }

  public async getEmbeddingFromCache(payload: any): Promise<any> {
    if (config.isProd === false) {
      const cache = JSON.parse(this.#cacheFile || "[]");
      const cached = cache.find(
        (c: any) =>
          c.input === payload.input &&
          c.model === payload.model &&
          c.user === payload.user
      );
      if (cached) {
        return cached;
      }
    }
    return null;
  }

  public async addEmbeddingToCache(payload: any): Promise<any> {
    if (config.isProd === false) {
      const cache = JSON.parse(this.#cacheFile || "[]");
      cache.push(payload);
      writeFileSync(
        join(__dirname, this.#CACHE_FILE),
        JSON.stringify(cache, null, 2)
      );
    }
  }
}

export default OpenAIEmbedding;
