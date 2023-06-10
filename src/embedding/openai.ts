import AEmbedding, {
  EmbeddingResponse,
  TEmbeddingOptions,
} from "@embedding/abstract.embedding";
import config from "@embedding/config";
import {
  Configuration,
  CreateModerationResponse,
  OpenAIApi,
} from "openai";

type TEmbeddingModel = "text-embedding-ada-002";
type TModerationModel = "text-moderation-latest" | "text-moderation-stable";

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

  constructor(
    model: TEmbeddingModel = "text-embedding-ada-002",
    moderationModel: TModerationModel = "text-moderation-latest"
  ) {
    super();
    this.#openai = new OpenAIApi(this.#configuration);
    this.#model = model;
    this.#moderationModel = moderationModel;
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

    const resp = await this.#openai.createEmbedding(payload);

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

  public  getEmbeddingModel(): string {
    return this.#model;
  }

  public getModerationModel(): string {
    return this.#moderationModel;
  }
}

export default OpenAIEmbedding;
