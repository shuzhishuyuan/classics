import mysql from 'mysql2/promise'

/** MySQL 全量建表（与 SQLite 表结构对齐） */
export async function runMysqlMigrations() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'shuyuan',
    waitForConnections: true,
    connectionLimit: 1,
  })

  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(20) NOT NULL,
      phone VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL DEFAULT '学生',
      avatar VARCHAR(50) NOT NULL DEFAULT '🧑‍🎓',
      school VARCHAR(100) NOT NULL DEFAULT '未设置',
      grade VARCHAR(50) NOT NULL DEFAULT '未设置',
      subject VARCHAR(50),
      student_name VARCHAR(20),
      student_grade VARCHAR(50),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS refresh_tokens (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      token VARCHAR(36) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS classic_favorites (
      user_id VARCHAR(36) NOT NULL,
      classic_id VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, classic_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS user_enrolled (
      user_id VARCHAR(36) NOT NULL,
      classic_id VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, classic_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS reading_progress (
      user_id VARCHAR(36) NOT NULL,
      classic_id VARCHAR(50) NOT NULL,
      chapter_id VARCHAR(50) NOT NULL,
      progress FLOAT NOT NULL DEFAULT 0,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, classic_id, chapter_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS user_notes (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      classic_id VARCHAR(50) NOT NULL,
      chapter_id VARCHAR(50),
      content TEXT NOT NULL,
      is_public TINYINT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS resource_favorites (
      user_id VARCHAR(36) NOT NULL,
      resource_id VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, resource_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS recitations (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      classic_id VARCHAR(50) NOT NULL,
      chapter_id VARCHAR(50),
      audio_url VARCHAR(500),
      duration FLOAT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS recitation_likes (
      user_id VARCHAR(36) NOT NULL,
      recitation_id VARCHAR(36) NOT NULL,
      PRIMARY KEY (user_id, recitation_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS discussions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      classic_id VARCHAR(50),
      topic VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS discussion_replies (
      id VARCHAR(36) PRIMARY KEY,
      discussion_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS practice_tasks (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      dimension VARCHAR(20),
      related_classic_id VARCHAR(50),
      examples TEXT,
      completed_count INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS task_submissions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      task_id VARCHAR(36) NOT NULL,
      content TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS search_history (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      keyword VARCHAR(200) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS shared_resources (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(20) NOT NULL DEFAULT '学生学习',
      type VARCHAR(20) NOT NULL DEFAULT '图文',
      tags TEXT DEFAULT '[]',
      file_url VARCHAR(500),
      downloads INT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS uploaded_files (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      mimetype VARCHAR(100) NOT NULL,
      size INT NOT NULL DEFAULT 0,
      url VARCHAR(500) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ]

  for (const sql of statements) {
    await pool.execute(sql)
  }

  // 二级索引
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)',
    'CREATE INDEX IF NOT EXISTS idx_refresh_token ON refresh_tokens(token)',
    'CREATE INDEX IF NOT EXISTS idx_favorites_user ON classic_favorites(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_enrolled_user ON user_enrolled(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_progress_user ON reading_progress(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_notes_user ON user_notes(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_recitations_user ON recitations(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_discussions_classic ON discussions(classic_id)',
    'CREATE INDEX IF NOT EXISTS idx_replies_discussion ON discussion_replies(discussion_id)',
    'CREATE INDEX IF NOT EXISTS idx_recitation_likes_rec ON recitation_likes(recitation_id)',
    'CREATE INDEX IF NOT EXISTS idx_progress_classic ON reading_progress(classic_id)',
    'CREATE INDEX IF NOT EXISTS idx_shared_category ON shared_resources(category)',
    'CREATE INDEX IF NOT EXISTS idx_shared_user ON shared_resources(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_discussions_user ON discussions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_replies_user ON discussion_replies(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_task_submissions_user ON task_submissions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_uploaded_files_user ON uploaded_files(user_id)',
  ]
  for (const sql of indexes) {
    await pool.execute(sql).catch(() => { /* 索引可能已存在 */ })
  }

  await pool.end()
  console.log('  📦 MySQL 表已就绪')
}
