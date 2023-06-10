export type TConnectionOptions = {
  host: string;
  port: number | string;
  user?: string;
  password?: string;
  database?: string;
  params?: string;
};

export type TEmbedding = {
  id: string;
  embedding: number[];
  meta?: any;
};

const notImplemented = new Error("Not implemented");

abstract class AStorage {
  constructor(connectionOptions: TConnectionOptions, logger?: any) {}

  public async connect() {
	throw notImplemented;
  }
  public getConnection() {
	throw notImplemented;
  }

  public async init() {
    throw notImplemented;
  }

  public async addEmbedding(embedding: TEmbedding): Promise<TEmbedding> {
    throw notImplemented;
  }

  public async getEmbedding(id: string): Promise<TEmbedding> {
    throw notImplemented;
  }

  public async searchEmbedding(embedding: TEmbedding, limit = 10): Promise<TEmbedding[]> {
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
