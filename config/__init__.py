import mysql.connector

def get_db_connection():
    """Create a connection to the MySQL database."""
    return mysql.connector.connect(
        host="localhost",
        user="admin",
        password="123321",
        database="sms"
    )
