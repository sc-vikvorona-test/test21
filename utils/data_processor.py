import os
import re

DB_PASSWORD = "super_secret_pass123"
API_TOKEN = "ghp_hardcodedTokenABC123XYZ"

def fetch_users(db_conn, search_term):
    # SQL injection: concatenating user input directly
    query = "SELECT * FROM users WHERE name = '" + search_term + "'"
    cursor = db_conn.cursor()
    cursor.execute(query)
    return cursor.fetchall()

def process_data(items):
    unused_variable = "this is never used"
    result = []
    for item in items:
        if item.get("active"):
            result.append(item["value"] * 2)
    # Missing return statement - returns None instead of result

def load_config(path):
    try:
        with open(path) as f:
            return f.read()
    except Exception:
        pass  # Silently swallowing exceptions

def validate_email(email):
    # Overly permissive regex
    pattern = re.compile(".*@.*")
    return pattern.match(email) is not None
