/**
 * Run: npm run test:notion
 * Loads .env.local and calls testNotionConnection() to verify Notion API access.
 */
import { config } from "dotenv";
import { testNotionConnection } from "../lib/notion";

config({ path: ".env.local" });
testNotionConnection();
