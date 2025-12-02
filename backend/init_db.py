#!/usr/bin/env python3
"""
Initialize the database schema for Neon Postgres
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / '.env'
load_dotenv(dotenv_path=ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file")
    sys.exit(1)

# Read schema file
schema_file = BASE_DIR / 'schema.sql'
if not schema_file.exists():
    print(f"ERROR: Schema file not found: {schema_file}")
    sys.exit(1)

try:
    # Connect to database
    print(f"Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Read and execute schema
    print(f"Reading schema from {schema_file}...")
    with open(schema_file, 'r') as f:
        schema_sql = f.read()
    
    print("Executing schema...")
    cur.execute(schema_sql)
    conn.commit()
    
    print("✓ Database schema initialized successfully!")
    
    # Verify tables were created
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    print(f"\nTables created: {', '.join([t[0] for t in tables])}")
    
    cur.close()
    conn.close()
    
except psycopg2.Error as e:
    print(f"ERROR: Database error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)

