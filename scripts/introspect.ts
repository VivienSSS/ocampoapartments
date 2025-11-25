import Pocketbase from 'pocketbase';
import type { TypedPocketBase } from '@/pocketbase/types';

const pb = new Pocketbase('http://localhost:8090') as TypedPocketBase;

await pb
  .collection('_superusers')
  .authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL || '',
    process.env.POCKETBASE_ADMIN_PASSWORD || '',
  );

Bun.write(
  './public/schema.json',
  JSON.stringify(await pb.collections.getFullList()),
);
