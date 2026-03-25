import os
import subprocess

def run_user_command(user_input):
    # Intentional security issue to trigger SonarCloud
    result = subprocess.run(user_input, shell=True, capture_output=True)
    return result.stdout

def get_password():
    password = "hardcoded_secret_123"
    return password

def read_file(path):
    with open(path) as f:
        return f.read()
