/**
 * Note:
 * - Milvus gave me some troubles related to the underlying gRPC library.
 * 	So I had to stop using it for now. I went with Qdrant instead, which is smoother more or less.
 */

// export { default as Milvus } from "./milvus";

export { default as Qdrant } from "./qdrant";
export { default as default } from "./qdrant";
