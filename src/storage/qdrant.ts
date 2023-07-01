import { QdrantClient } from "@qdrant/js-client-rest";
import config from "@storage/config";
import { v4 as generateId } from "uuid";
import AStorage, {
  QueryStatus,
  TConnectionOptions,
  TEmbedding,
  TEmbeddingMeta,
  TSearchResult,
  TVec,
} from "./storage.abstract";

const COLLECTION_CONFIG = {
  NAME: "messages",
  VECTOR_DIMENSION: 1536, // (text-embedding-ada-002)
  TEXT_LEN: 256,
};

class Qdrant extends AStorage {
  private client: QdrantClient;

  constructor(connectionOptions: TConnectionOptions = { ...config.qdrant }) {
    super(connectionOptions);
    this.client = new QdrantClient({
      host: connectionOptions.host,
      port: +connectionOptions.port,
    });
  }

  public async init() {
    try {
      if (config.isProduction === false) {
        // await this.client.deleteCollection(COLLECTION_CONFIG.NAME);
        console.log(`[WARN] Collection ${COLLECTION_CONFIG.NAME} deleted`);
      }
      if (await this.client.getCollection(COLLECTION_CONFIG.NAME)) {
        console.log(`[INFO] Collection ${COLLECTION_CONFIG.NAME} exists`);
        return;
      }
      await this.client.createCollection(COLLECTION_CONFIG.NAME, {
        vectors: {
          size: COLLECTION_CONFIG.VECTOR_DIMENSION,
          distance: "Cosine",
        },
      });

      await this.client.createPayloadIndex(COLLECTION_CONFIG.NAME, {
        field_name: "original_text",
        field_schema: "keyword",
        wait: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async addEmbedding(embedding: TEmbedding): Promise<QueryStatus> {
    const id = generateId();
    const resp = await this.client.upsert(COLLECTION_CONFIG.NAME, {
      points: [
        {
          id: id,
          vector: embedding.embedding as number[],
          payload: {
            original_text: embedding.meta?.original_text,
            author_id: embedding.meta?.author_id,
            author_name: embedding.meta?.author_name,
            timestamp: embedding.meta?.timestamp,
          },
        },
      ],
    });

    const collectionInfo = await this.client.getCollection(
      COLLECTION_CONFIG.NAME
    );
    // console.log("Qdrant collection info", collectionInfo);
    // console.log("collectionInfo.vector_count", collectionInfo.vectors_count);
    return resp.status.toUpperCase() as QueryStatus;
  }

  public async search(
    vector: TVec,
    limit: number = 4
  ): Promise<TSearchResult[]> {
    const results = await this.client.search(COLLECTION_CONFIG.NAME, {
      vector,
      limit: limit,
      with_payload: true,
    });
    // tempo
    return results.map((res) => ({
      ...res,
      meta: res.payload as TEmbeddingMeta,
    }));
  }
}

export default Qdrant;
