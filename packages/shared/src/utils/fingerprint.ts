import crypto from 'crypto';

export const fingerprintContent = (input: string) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};
