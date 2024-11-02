import { eq } from 'drizzle-orm'

import db from '~/db'
import { personTable } from '~/db/schema'
import { CacheData } from '~/enums'
import { cache } from '~/utils/cache'

export const getFirstNameFromDB = async (userId: string) => {
  let user: any = null
  if (cache.has(JSON.stringify({ data: CacheData.FIRST_NAME, userId }))) {
    user = cache.get(JSON.stringify({ data: CacheData.FIRST_NAME, userId }))
  } else {
    const query = await db
      .select({ firstName: personTable.firstName })
      .from(personTable)
      .where(eq(personTable.id, userId))
    if (query.length === 0) {
      user = null
    } else {
      user = { firstName: query[0].firstName }
    }
  }
  return user
}
