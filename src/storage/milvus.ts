/*
** This is not a complete implementation of the Milvus storage adapter.
*/
import {
  MilvusClient,
  DataType,
  SearchSimpleReq,
  SearchReq,
  SearchParam,
  CreateCollectionReq,
  CreateColReq,
  CreateIndexParam,
} from "@zilliz/milvus2-sdk-node";
import AStorage, {
  TConnectionOptions,
  TEmbedding,
  TSearchResult,
  TVec,
} from "./storage.abstract";
import config from "@storage/config";

const COLLECTION_CONFIG = {
  NAME: "messages",
  VECTOR_DIMENSION: 1536, // (text-embedding-ada-002)
  TEXT_LEN: 256,
};

class Milvus extends AStorage {
  // class Milvus {
  private client: MilvusClient;

  constructor(connectionOptions: TConnectionOptions = { ...config.milvus }) {
    super(connectionOptions);
    this.client = new MilvusClient(
      connectionOptions.host + ":" + connectionOptions.port,
      connectionOptions.ssl,
      connectionOptions.user,
      connectionOptions.password
    );
  }

  public async connect() {
    // this.client.connect(MilvusClient.sdkInfo.version);
  }

  public async end(): Promise<void> {
    this.client.closeConnection();
  }

  public getConnection(): MilvusClient {
    return this.client;
  }

  public async init(): Promise<void> {
    if (
      await this.client.hasCollection({
        collection_name: COLLECTION_CONFIG.NAME,
      })
    ) {
      console.log("[INFO] Milvus collection already exists, dropping");
      await this.client.dropCollection({
        collection_name: COLLECTION_CONFIG.NAME,
      });
    }

    const collectionParams: CreateCollectionReq = {
      collection_name: COLLECTION_CONFIG.NAME,
      description: "messages collection for search",

      fields: [
        {
          name: "vector",
          description: "orgianl vector returned by model",
          data_type: DataType.FloatVector,
          dim: COLLECTION_CONFIG.VECTOR_DIMENSION,
        },
        {
          name: "id",
          data_type: DataType.Int64,
          is_primary_key: true,
          autoID: true,
        },
        {
          name: "author_id",
          data_type: DataType.Int64,
        },
        {
          name: "author_name",
          data_type: DataType.VarChar,
          max_length: 256,
        },
        {
          name: "original_text",
          data_type: DataType.VarChar,
          max_length: COLLECTION_CONFIG.TEXT_LEN,
        },
        {
          name: "timestamp",
          data_type: DataType.Int64,
        },
      ],
    };

    const indexParams: CreateIndexParam = {
      //   metric_type: "IP",
      //   index_type: "IVF_FLAT",
      metric_type: "L2",
      index_type: "IVF_SQ8",
      params: JSON.stringify({ nlist: 1024 }),
    };

    try {
      console.log("[INFO] Milvus collections initializing");
      const embeddingCollection = await this.client.createCollection(
        collectionParams
      );
      await this.client.createIndex({
        collection_name: COLLECTION_CONFIG.NAME,
        field_name: "vector",
        extra_params: indexParams,
      });
      await this.client.createIndex({
        collection_name: COLLECTION_CONFIG.NAME,
        field_name: "original_text",
        index_name: "original_text_index",
        extra_params: {
          metric_type: "JACCARD",
          index_type: "FLAT",
          params: JSON.stringify({ nlist: 1024 }),
        },
      });
      console.log(embeddingCollection);
    } catch (e) {
      console.log(e);
    }
    console.log("[INFO] Milvus collections initialized");
  }

  public async addEmbedding(embedding: TEmbedding): Promise<any> {
    console.log("[INFO] Milvus addEmbedding", {
      ...embedding,
      meta: embedding.meta,
      embedding: embedding.embedding.length,
    });
    let promise;
    try {
      promise = await this.client.insert({
        collection_name: COLLECTION_CONFIG.NAME,
        data: [
          {
            vector: embedding.embedding,
            author_id: (embedding.meta as any).author_id,
            author_name: (embedding.meta as any).author_name,
            original_text: (embedding.meta as any).original_text,
            timestamp: (embedding.meta as any).timestamp,
          },
        ],
      });
      return promise;
    } catch (e) {
      console.error(e);
    }
    return promise;
  }

  public async searchEmbedding(
    vector: TVec,
    limit: number = 10
  ): Promise<TSearchResult[]> {
    const searchParams: SearchParam = {
      anns_field: "vector",
      topk: limit + "",
      metric_type: "L2",

      params: JSON.stringify({ nprobe: 16 }),
    };

    const state = await this.client.loadCollectionSync({
      collection_name: COLLECTION_CONFIG.NAME,
    });

    console.log("State", state);

    const normalizedVector = vector; //

    if (state.error_code !== "Success") {
      console.log("[ERROR] Milvus loadCollectionSync", state);
      return [];
    }

    console.log("[INFO] Milvus searchEmbedding", {
      vector_length: normalizedVector.length,
    });
    return [];
  }

  // dev function
  public async callFunction(func: (client: MilvusClient) => any): Promise<any> {
    return func(this.client);
  }
}

export default Milvus;
