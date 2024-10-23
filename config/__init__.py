import mysql.connector
import redis

def get_db_connection():
    """Create a connection to the MySQL database."""
    return mysql.connector.connect(
        host="localhost",
        user="admin",
        password="123321",
        database="sms"
    )

def connect_to_redis():
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    return redis_client
