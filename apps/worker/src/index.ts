import dotenv from 'dotenv';
import { translateAndSummarize } from './handlers/translationHandler';
import { createLogger } from '@shared';

dotenv.config();
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
