from config import get_db_connection

def log_sms(country, operator, status, error_message=None):
    """Log SMS attempt in the database."""
    db = get_db_connection()
    cursor = db.cursor()
    query = """
        INSERT INTO sms_metrics (country, operator, status, error_message)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (country, operator, status, error_message))
    db.commit()
    cursor.close()
    db.close()

def get_metrics():
    """Fetch real-time SMS metrics."""
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    query = """
        SELECT country, operator, status, COUNT(*) AS count
        FROM sms_metrics
        GROUP BY country, operator, status
    """
    cursor.execute(query)
    metrics = cursor.fetchall()
    cursor.close()
    db.close()
    return metrics
