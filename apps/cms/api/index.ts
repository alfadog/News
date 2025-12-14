import { createPayloadServer } from '../src/server';

let cachedApp: any;

async function getApp() {
  if (!cachedApp) {
    cachedApp = await createPayloadServer();
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}
