import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';
import payload from 'payload';
import dotenv from 'dotenv';

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

let payloadConfigPromise: Promise<typeof import('./payload/payload.config')>;

type StartOptions = { serve?: boolean };

export async function createPayloadServer({ serve = false }: StartOptions = {}) {
  const app = express();
  const databaseURI = process.env.DATABASE_URI;

  if (!databaseURI) {
    throw new Error('DATABASE_URI must be set to start Payload CMS');
  }

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', server: 'payload', url: process.env.PAYLOAD_PUBLIC_SERVER_URL });
  });

  const payloadConfig = (await (payloadConfigPromise ||= import('./payload/payload.config'))).default;

  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-secret',
    express: app,
    onInit: () => {
      payload.logger.info('Payload admin URL:', payload.getAdminURL());
    },
    config: payloadConfig
  });

  if (serve) {
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => {
      payload.logger.info(`Payload server running at http://localhost:${port}`);
    });
  }

  return app;
}

if (require.main === module) {
  createPayloadServer({ serve: true }).catch((error) => {
    payload.logger.error(error);
    process.exit(1);
  });
}

export default createPayloadServer;
