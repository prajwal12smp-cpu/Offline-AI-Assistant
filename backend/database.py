import sqlite3
import os

DB_FILENAME = "classroom_data.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILENAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    # 1. Chat History Table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            role TEXT,
            role TEXT,
            content TEXT,
            subject TEXT DEFAULT 'science',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    try:
        conn.execute("ALTER TABLE chat_history ADD COLUMN subject TEXT DEFAULT 'science'")
    except sqlite3.OperationalError:
        pass
    # 2. Gamification Stats
    conn.execute('''
        CREATE TABLE IF NOT EXISTS user_stats (
            user_id TEXT PRIMARY KEY,
            questions_asked INTEGER DEFAULT 0,
            quizzes_passed INTEGER DEFAULT 0,
            physics_points INTEGER DEFAULT 0,
            maths_points INTEGER DEFAULT 0,
            chemistry_points INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SQLite database initialized successfully.")
