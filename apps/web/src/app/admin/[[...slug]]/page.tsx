import { Admin } from '@payloadcms/next/admin/app';
import payloadConfig from '../../../payload/payload.config';

export const dynamic = 'force-dynamic';

export default Admin({ config: payloadConfig });
