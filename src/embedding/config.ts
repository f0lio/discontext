import { config as dotenvConfig } from "dotenv";
import { getENV } from "@shared/utils";

dotenvConfig();

export default {
  openai_api_key: getENV("OPENAI_API_KEY", true),
  isProd: getENV("NODE_ENV") === "production",
};
