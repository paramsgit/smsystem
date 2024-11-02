import mysql.connector
import redis

def get_db_connection():
    """Create a connection to the MySQL database, and ensure required tables exist."""
    try:
        # Connect to MySQL server (without specifying the database initially)
        connection = mysql.connector.connect(
            host="localhost",
            user="admin",
            password="123321"
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Check if the 'sms' database exists
            cursor.execute("SHOW DATABASES LIKE 'sms'")
            if not cursor.fetchone():
                cursor.execute("CREATE DATABASE sms")
                print("Database 'sms' created successfully.")
            
            # Connect to the 'sms' database
            connection.database = "sms"
            
            # Check and create 'country_operator_pairs' table if it doesn't exist
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS country_operator_pairs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    country VARCHAR(50) NOT NULL,
                    operator VARCHAR(50) NOT NULL,
                    is_high_priority BOOLEAN DEFAULT FALSE
                )
            """)
            print("Table 'country_operator_pairs' is ready.")
            
            # Check and create 'sms_metrics' table if it doesn't exist
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sms_metrics (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    country VARCHAR(50),
                    operator VARCHAR(50),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status ENUM('sent', 'failed') NOT NULL,
                    error_message TEXT
                )
            """)
            print("Table 'sms_metrics' is ready.")
            
            return connection

    except Exception as e:
        print("Error while connecting to MySQL", e)

def connect_to_redis():
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    return redis_client
