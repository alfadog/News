import { payloadHandler } from '@payloadcms/next/routeHandler';
import payloadConfig from '../../../../../payload/payload.config';

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS, dynamic } = payloadHandler({
  config: payloadConfig,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret'
});
