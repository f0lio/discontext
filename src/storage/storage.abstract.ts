export type TConnectionOptions = {
  host: string;
  port: number | string;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
  params?: string;
};

export type TVec = number[];

export type TEmbeddingMeta = {
  id: string;
  original_text: string;
  author_id?: string;
  author_name?: string;
  timestamp?: number;
  link?: string;
};

export type TEmbedding = {
  embedding: TVec;
  id?: string; // optional, if not provided, will be generated
  meta?: TEmbeddingMeta
};

export type TSearchResult = {
  id: string;
  score: number; // similarity score
  meta?: TEmbeddingMeta
};

const notImplemented = new Error("Not implemented");

abstract class AStorage {
  constructor(connectionOptions: TConnectionOptions, logger?: any) {}

  async connect() {
    throw notImplemented;
  }

  public getConnection() {
    throw notImplemented;
  }

  /**
   * This is where you should, if necessary, connect to the database and
   * create tables, etc.
   */
  public async init() {
    throw notImplemented;
  }

  public async addEmbedding(embedding: TEmbedding): Promise<TEmbedding> {
    throw notImplemented;
  }

  public async getEmbedding(id: string): Promise<TEmbedding> {
    throw notImplemented;
  }

  public async searchEmbedding(
    vector: TVec,
    limit = 10
  ): Promise<TSearchResult[]> {
    throw notImplemented;
  }

  public async end() {
    throw notImplemented;
  }

  public async ping(): Promise<boolean> {
    throw notImplemented;
  }

  public async isConnected(): Promise<boolean> {
    throw notImplemented;
  }
  public logInfo(message: string, meta?: any) {
    throw notImplemented;
  }
  public logError(message: string, meta?: any) {
    throw notImplemented;
  }
  public logWarn(message: string, meta?: any) {
    throw notImplemented;
  }
}

export default AStorage;
