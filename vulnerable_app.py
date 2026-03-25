import subprocess
import os

PASSWORD = "hardcoded_secret_123"

def run_command(user_input):
    cmd = "ls " + user_input
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def connect_to_db():
    db_password = "admin123"
    connection_string = f"postgresql://admin:{db_password}@localhost/mydb"
    return connection_string

if __name__ == "__main__":
    user_data = input("Enter directory: ")
    output = run_command(user_data)
    print(output)
