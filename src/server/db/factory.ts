import type { AppRepositories } from './repository'
import { sqliteUserRepo, sqliteTokenRepo } from './sqlite-repo'
import { mysqlUserRepo, mysqlTokenRepo } from './mysql-repo'

export function getRepos(): AppRepositories {
  const dbType = process.env.DB_TYPE || 'sqlite'

  if (dbType === 'mysql') {
    return { user: mysqlUserRepo, token: mysqlTokenRepo }
  }

  return { user: sqliteUserRepo, token: sqliteTokenRepo }
}
