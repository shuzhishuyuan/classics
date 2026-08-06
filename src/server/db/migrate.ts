import db from './connection'

/** SQLite 全量建表 */
export function runSqliteMigrations() {
  db.exec(`
    -- 用户表 (auth)
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      phone         TEXT NOT NULL UNIQUE,
      password      TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT '学生',
      avatar        TEXT NOT NULL DEFAULT '🧑‍🎓',
      school        TEXT NOT NULL DEFAULT '未设置',
      grade         TEXT NOT NULL DEFAULT '未设置',
      subject       TEXT,
      student_name  TEXT,
      student_grade TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 刷新令牌
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      token       TEXT NOT NULL UNIQUE,
      expires_at  TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 典籍收藏
    CREATE TABLE IF NOT EXISTS classic_favorites (
      user_id    TEXT NOT NULL,
      classic_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, classic_id)
    );

    -- 加入学习
    CREATE TABLE IF NOT EXISTS user_enrolled (
      user_id    TEXT NOT NULL,
      classic_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, classic_id)
    );

    -- 阅读进度
    CREATE TABLE IF NOT EXISTS reading_progress (
      user_id    TEXT NOT NULL,
      classic_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      progress   REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, classic_id, chapter_id)
    );

    -- 笔记
    CREATE TABLE IF NOT EXISTS user_notes (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      classic_id  TEXT NOT NULL,
      chapter_id  TEXT,
      content     TEXT NOT NULL,
      is_public   INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 资源收藏
    CREATE TABLE IF NOT EXISTS resource_favorites (
      user_id     TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, resource_id)
    );

    -- 诵读记录
    CREATE TABLE IF NOT EXISTS recitations (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      classic_id  TEXT NOT NULL,
      chapter_id  TEXT,
      audio_url   TEXT,
      duration    REAL NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS recitation_likes (
      user_id       TEXT NOT NULL,
      recitation_id TEXT NOT NULL,
      PRIMARY KEY (user_id, recitation_id)
    );

    -- 会讲讨论
    CREATE TABLE IF NOT EXISTS discussions (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      classic_id  TEXT,
      topic       TEXT NOT NULL,
      content     TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS discussion_replies (
      id            TEXT PRIMARY KEY,
      discussion_id TEXT NOT NULL,
      user_id       TEXT NOT NULL,
      content       TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE
    );

    -- 实践任务
    CREATE TABLE IF NOT EXISTS practice_tasks (
      id                 TEXT PRIMARY KEY,
      title              TEXT NOT NULL,
      description        TEXT,
      dimension          TEXT,
      related_classic_id TEXT,
      examples           TEXT,
      completed_count    INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS task_submissions (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      task_id    TEXT NOT NULL,
      content    TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 搜索历史
    CREATE TABLE IF NOT EXISTS search_history (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      keyword    TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 用户投稿的共享资源
    CREATE TABLE IF NOT EXISTS shared_resources (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      category    TEXT NOT NULL DEFAULT '学生学习',
      type        TEXT NOT NULL DEFAULT '图文',
      tags        TEXT DEFAULT '[]',
      file_url    TEXT,
      downloads   INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- 上传文件
    CREATE TABLE IF NOT EXISTS uploaded_files (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      filename    TEXT NOT NULL,
      mimetype    TEXT NOT NULL,
      size        INTEGER NOT NULL DEFAULT 0,
      url         TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 索引
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    CREATE INDEX IF NOT EXISTS idx_refresh_token ON refresh_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_favorites_user ON classic_favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_enrolled_user ON user_enrolled(user_id);
    CREATE INDEX IF NOT EXISTS idx_progress_user ON reading_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_user ON user_notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_recitations_user ON recitations(user_id);
    CREATE INDEX IF NOT EXISTS idx_discussions_classic ON discussions(classic_id);
    CREATE INDEX IF NOT EXISTS idx_replies_discussion ON discussion_replies(discussion_id);
    CREATE INDEX IF NOT EXISTS idx_recitation_likes_rec ON recitation_likes(recitation_id);
    CREATE INDEX IF NOT EXISTS idx_progress_classic ON reading_progress(classic_id);
    CREATE INDEX IF NOT EXISTS idx_shared_category ON shared_resources(category);
    CREATE INDEX IF NOT EXISTS idx_shared_user ON shared_resources(user_id);
    CREATE INDEX IF NOT EXISTS idx_discussions_user ON discussions(user_id);
    CREATE INDEX IF NOT EXISTS idx_replies_user ON discussion_replies(user_id);
    CREATE INDEX IF NOT EXISTS idx_task_submissions_user ON task_submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_uploaded_files_user ON uploaded_files(user_id);
  `)
}
