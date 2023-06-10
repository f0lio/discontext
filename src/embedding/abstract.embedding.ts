/* 
	Abstract class for embedding services (engines) for the sake of simplicity and modularity.
	The basic requirements for an embedding service in our case are:
    - connect() to the service
	- get_an_embedding() for a given text
	- get_a_similarity() score between two texts (not really necessary, but can be useful)
*/

// Unifying the response type between different embedding services
export type EmbeddingResponse = {
  prompt_tokens: number;
  total_tokens: number; // the generated tokens
  embedding: number[];
  model: string;
  original_text?: string;
};

const notImplemented = new Error("Not implemented");

export type TEmbeddingOptions = {
  model?: string;
  user?: string; // for moderation
};

abstract class AEmbedding<
  TModerationModel,
  TModerationResponse
> {
  
  public async getEmbedding(
    text: string,
    options?: TEmbeddingOptions
  ): Promise<EmbeddingResponse> {
    throw notImplemented;
  }

  public async getSimilarity(
    text1: string,
    text2: string,
    options?: TEmbeddingOptions
  ): Promise<number> {
    throw notImplemented;
  }

  public async getModeration(
    text: string,
    model?: TModerationModel
  ): Promise<TModerationResponse> {
    throw notImplemented;
  }

  public getEmbeddingModel(): string {
    throw notImplemented;
  }

  public getModerationModel(): string {
    throw notImplemented;
  }
}

export default AEmbedding;
