import {createKysely} from '@vercel/postgres-kysely';
import {ColumnType, Generated} from 'kysely';

/**********************************************
*              databases
***********************************************/
export interface Database {
  sw_requirement: SWReqTable
}

/**********************************************
 *              tables
 ***********************************************/
// software requirements
interface SWReqTable {
  id: Generated<number>
  summary: string
  description: string
  verification: string
  created_at: ColumnType<Date, string | undefined, never>
}

export const db = createKysely<Database>()
export { sql } from 'kysely'
