import {db, sql} from './database'

export async function CreateSWReqTable() {
  await db.schema
    .createTable('sw_requirement')
    .ifNotExists()
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('summary', 'varchar', (cb) => cb.notNull())
    .addColumn('description', 'varchar', (cb) => cb.notNull())
    .addColumn('verification', 'varchar', (cb) => cb.notNull())
    .addColumn('created_at', 'timestamp', (cb) => cb.notNull().defaultTo(sql`now()`)
    )
    .execute()
}

export async function InsertSWReq(summary: string, description: string, verification: string) {
  return await db
    .insertInto('sw_requirement')
    .values({
      summary: summary,
      description: description,
      verification: verification
    })
    .executeTakeFirst()
}

export async function ListSWReqPagination(offset: number , limit: number) {
  return await db
    .selectFrom('sw_requirement')
    .selectAll()
    .offset(offset)
    .limit(limit)
    .execute()
}

export async function ListAllSWReq(){
  return await db
    .selectFrom('sw_requirement')
    .selectAll()
    .execute()
}
