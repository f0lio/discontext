import {
	config as dotenvConfig,
} from 'dotenv'
import { getENV } from '@shared/utils'

dotenvConfig()
  
export default {
	botToken: getENV('DISCORD_BOT_TOKEN'),
	clientId: getENV('DISCORD_CLIENT_ID'),
	// clientSecret: getENV('DISCORD_CLIENT_SECRET'),
	guildId: getENV('DISCORD_DEV_SERVER_ID'),
	isProduction: false, //getENV('NODE_ENV') === 'production',
  }
  