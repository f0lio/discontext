import {
	config as dotenvConfig,
} from 'dotenv'
// import { getENV } from '@shared/utils'

dotenvConfig()
  
export default {
	// databaseURL: getENV('DATABASE_URL'),
	isProduction: false, //getENV('NODE_ENV') === 'production',
  }
  