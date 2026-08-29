import os
import re

def fetch_users(db_conn, search_term):
    # Use parameterized query to prevent SQL injection
    query = "SELECT * FROM users WHERE name = %s"
    cursor = db_conn.cursor()
    cursor.execute(query, (search_term,))
    return cursor.fetchall()

def process_data(items):
    result = []
    for item in items:
        if item.get("active"):
            result.append(item["value"] * 2)
    return result

def load_config(path):
    try:
        with open(path) as f:
            return f.read()
    except OSError as e:
        raise RuntimeError(f"Failed to load config from {path}") from e

def validate_email(email):
    pattern = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    return pattern.match(email) is not None
