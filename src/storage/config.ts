import {
	config as dotenvConfig,
} from 'dotenv'
import { getENV } from '@shared/utils'

dotenvConfig()

export default {
	milvus: {
		host: getENV('MILVUS_ADDRESS', true),
		username: getENV('MILVUS_USERNAME'),
		password: getENV('MILVUS_PASSWORD'),
		port: parseInt(getENV('MILVUS_PORT') || "19530"),
		ssl: getENV('MILVUS_SSL').toLowerCase() === 'true',
	},
	qdrant: {
		host: getENV('QDRANT_ADDRESS') || "localhost",
		port: parseInt(getENV('QDRANT_PORT') || "6333"),
		// username: getENV('QDRANT_USERNAME'),
		// password: getENV('QDRANT_PASSWORD'),
	},
	isProduction: getENV('NODE_ENV') === 'production',
  }