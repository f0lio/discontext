import { QdrantClient } from "@qdrant/js-client-rest";
import AStorage, {
  TConnectionOptions,
  TEmbedding,
  TSearchResult,
  TVec,
} from "./storage.abstract";
import { v4 as generateId } from "uuid";
import config from "@storage/config";

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
  
    await this.client.deleteCollection(COLLECTION_CONFIG.NAME);

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
    // console.log("Qdrant collection created", conn);
    } catch (e) {
      console.log(e);
    }
  }

  public async add(embedding: TEmbedding): Promise<any> {
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

    const collectionInfo = await this.client.getCollection(COLLECTION_CONFIG.NAME);
    return resp;
  }

  public async search(vector: TVec, limit: number = 4): Promise<any> {
    const result = await this.client.search(COLLECTION_CONFIG.NAME, {
      vector,
      limit: limit,
      with_payload: true,
    });
    // console.log("Qdrant search result", result);
    return result;
  }
}

export default Qdrant;
