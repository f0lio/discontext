import {
	config as dotenvConfig,
} from 'dotenv'
import { getENV } from '@shared/utils'

dotenvConfig()
  
export default {
	botToken: getENV('DISCORD_BOT_TOKEN', true),
	clientId: getENV('DISCORD_CLIENT_ID', true),
	// clientSecret: getENV('DISCORD_CLIENT_SECRET'),
	guildId: getENV('DISCORD_DEV_SERVER_ID', true),
	isProduction: getENV('NODE_ENV') === 'production',
  }
  