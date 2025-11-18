import * as crypto from 'crypto';

export function stringToHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
