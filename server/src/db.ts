import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema/index.ts';
import { env } from './lib/env.ts';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';

export const sqlite = new Database(env.DATABASE_URL, { create: true });

sqlite.run('PRAGMA journal_mode = WAL;');
sqlite.run('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });
export type Db = typeof db;

export type Tx = SQLiteTransaction<
	'sync',
	void,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;
