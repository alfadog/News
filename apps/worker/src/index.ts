import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { translateAndSummarize } from './handlers/translationHandler';
import { createLogger } from '@news/shared';

function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '..', '.env.local'),
    path.resolve(process.cwd(), '..', '..', '.env')
  ];

  const match = candidates.find((filePath) => fs.existsSync(filePath));
  if (match) {
    dotenv.config({ path: match });
  } else {
    dotenv.config();
  }
}

loadEnv();
const logger = createLogger('worker');

async function run() {
  logger.info('Worker starting translation job');
  try {
    await translateAndSummarize();
    logger.info('Worker finished translation job');
  } catch (error) {
    logger.error('Worker failed', { error: (error as Error).message });
    process.exitCode = 1;
  }
}

run();
