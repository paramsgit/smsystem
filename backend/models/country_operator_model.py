from config import get_db_connection

def create_pair(country, operator, is_high_priority=False):
    """Add a new country-operator pair."""
    db = get_db_connection()
    cursor = db.cursor()
    query = """
        INSERT INTO country_operator_pairs (country, operator, is_high_priority)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (country, operator, is_high_priority))
    db.commit()
    cursor.close()
    db.close()

def get_all_pairs():
    """Fetch all country-operator pairs."""
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    query = "SELECT * FROM country_operator_pairs"
    cursor.execute(query)
    pairs = cursor.fetchall()
    cursor.close()
    db.close()
    return pairs

def update_pair(pair_id, is_high_priority):
    """Update priority status of a pair only if it exists."""
    db = get_db_connection()
    cursor = db.cursor()

    # Check if the pair with the given ID exists
    query_check = "SELECT COUNT(*) FROM country_operator_pairs WHERE id = %s"
    cursor.execute(query_check, (pair_id,))
    exists = cursor.fetchone()[0] > 0

    if not exists:
        cursor.close()
        db.close()
        return False  # Pair does not exist

    # If the pair exists, perform the update
    query_update = "UPDATE country_operator_pairs SET is_high_priority = %s WHERE id = %s"
    cursor.execute(query_update, (is_high_priority, pair_id))
    db.commit()

    cursor.close()
    db.close()
    return True  # Update successful

def delete_pair(pair_id):
    """Delete a country-operator pair if not high-priority."""
    db = get_db_connection()
    cursor = db.cursor()

    query_check = "SELECT COUNT(*) FROM country_operator_pairs WHERE id = %s"
    cursor.execute(query_check, (pair_id,))
    exists = cursor.fetchone()[0] > 0

    if not exists:
        cursor.close()
        db.close()
        return False  # Pair does not exist

    query = "DELETE FROM country_operator_pairs WHERE id = %s AND is_high_priority = FALSE"
    cursor.execute(query, (pair_id,))
    db.commit()
    cursor.close()
    db.close()
    return True

def pair_exists(country, operator):
    """Check if a country-operator pair already exists."""
    db = get_db_connection()
    cursor = db.cursor()
    query = """
        SELECT COUNT(*) FROM country_operator_pairs
        WHERE country = %s AND operator = %s
    """
    cursor.execute(query, (country, operator))
    exists = cursor.fetchone()[0] > 0
    cursor.close()
    db.close()
    return exists
