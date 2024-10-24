from config import connect_to_redis

redis_client = connect_to_redis()  # Use your Redis connection

def get_bucket_key(country):
    """Generate a Redis key for the token bucket of a specific country."""
    return f"sms_bucket:{country}"

def initialize_bucket(country):
    """Initialize the token bucket with 10 tokens."""
    redis_client.set(get_bucket_key(country), 10, ex=60)  # Bucket expires after 60 seconds

def check_rate_limit(country):
    """Check if a country is allowed to send an SMS."""
    bucket_key = get_bucket_key(country)

    # Initialize the bucket if it doesn't exist
    if not redis_client.exists(bucket_key):
        initialize_bucket(country)

    # Atomically decrease token count and check availability
    tokens = redis_client.decr(bucket_key)

    if tokens < 0:
        # Restore the token if the bucket is empty
        redis_client.incr(bucket_key)
        return False  # Rate limit exceeded
    return True  # Allowed to send SMS
