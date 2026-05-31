// src/lib/zip/registry.ts
import type { ZipModule } from '@/types/zip';

import { createZipModule } from './core';
import { resolveYubinbangoAddress } from './providers/yubinbango';

export const zipRegistry: Record<string, ZipModule> = {
  // 標準の yubinbango プロバイダ
  yubinbango: createZipModule({
    providerName: 'yubinbango-data',
    resolveAddress: resolveYubinbangoAddress,
  }),
};
