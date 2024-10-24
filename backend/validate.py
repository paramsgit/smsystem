"""Validator Module"""
import re
from bson.objectid import ObjectId

def validate(data, regex):
    """Custom Validator"""
    return True if re.match(regex, data) else False

def validate_password(password: str):
    """Password Validator"""
    reg = r"\b^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$\b"
    return validate(password, reg)

def validate_email(email: str):
    """Email Validator"""
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return validate(email, regex)

def validate_book(**args):
    """Book Validator"""
    if not args.get('title') or not args.get('image_url') \
        or not args.get('category') or not args.get('user_id'):
        return {
            'title': 'Title is required',
            'image_url': 'Image URL is required',
            'category': 'Category is required',
            'user_id': 'User ID is required'
        }
    if args.get('category') not in ['romance', 'peotry', 'politics' 'picture book', 'science', 'fantasy', 'horror', 'thriller']:
        return {
            'status': 'error',
            'message': 'Invalid category'
        }
    try:
        ObjectId(args.get('user_id'))
    except:
        return {
            'user_id': 'User ID must be valid'
        }
    if not isinstance(args.get('title'), str) or not isinstance(args.get('description'), str) \
        or not isinstance(args.get('image_url'), str):
        return {
            'title': 'Title must be a string',
            'description': 'Description must be a string',
            'image_url': 'Image URL must be a string'
        }
    return True

def validate_user(**args):
    """User Validator"""
    if  not args.get('email') or not args.get('password') or not args.get('name'):
        return {
            'email': 'Email is required',
            'password': 'Password is required',
            'name': 'Name is required'
        }
    if not isinstance(args.get('name'), str) or \
        not isinstance(args.get('email'), str) or not isinstance(args.get('password'), str):
        return {
            'email': 'Email must be a string',
            'password': 'Password must be a string',
            'name': 'Name must be a string'
        }
    if not validate_email(args.get('email')):
        return {
            'email': 'Email is invalid'
        }
    if not validate_password(args.get('password')):
        return {
            'password': 'Password is invalid, Should be atleast 8 characters with \
                upper and lower case letters, numbers and special characters'
        }
    if not 2 <= len(args['name'].split(' ')) <= 30:
        return {
            'name': 'Name must be between 2 and 30 words'
        }
    return True

def validate_email_and_password(email, password):
    """Email and Password Validator"""
    if not (email and password):
        return {
            'email': 'Email is required',
            'password': 'Password is required'
        }
    if not validate_email(email):
        return {
            'email': 'Email is invalid'
        }
    if not validate_password(password):
        return {
            'password': 'Password is invalid, Should be atleast 8 characters with \
                upper and lower case letters, numbers and special characters'
        }
    return True

def validate_sms_data(**args):
    """SMS Data Validator"""
    
    # Required fields validation
    missing_fields = {
        'phone_number': 'Phone number is required',
        'proxy': 'Proxy is required',
        'country': 'Country is required',
        'operator': 'Operator is required'
    }
    
    errors = {key: message for key, message in missing_fields.items() if not args.get(key)}
    
    if errors:
        return {
            'status': 'error',
            'errors': errors
        }

    # Validate that country and operator are strings
    if not isinstance(args.get('country'), str) or not isinstance(args.get('operator'), str):
        return {
            'status': 'error',
            'message': 'Country and Operator must be strings'
        }

    # Validate phone number (simple length check)
    phone_number = args.get('phone_number')
    if not isinstance(phone_number, str) or not phone_number.isdigit() or len(phone_number) < 10:
        return {
            'status': 'error',
            'message': 'Phone number must be a valid numeric string of at least 10 digits'
        }

    # Validate proxy (can extend with more logic if needed)
    if not isinstance(args.get('proxy'), str):
        return {
            'status': 'error',
            'message': 'Proxy must be a string'
        }

    # All validations passed
    return True

def validate_pair_data(**args):
    """Pair Data Validator"""

    # Check if country and operator are provided and are strings
    if not args.get('country') or not isinstance(args.get('country'), str):
        return {'status': 'error', 'message': 'Country is required and must be a string'}
    
    if not args.get('operator') or not isinstance(args.get('operator'), str):
        return {'status': 'error', 'message': 'Operator is required and must be a string'}

    # Check if is_high_priority is a boolean (default to False if not provided)
    is_high_priority = args.get('is_high_priority', False)
    if not isinstance(is_high_priority, bool):
        return {'status': 'error', 'message': 'is_high_priority must be a boolean'}

    # All validations passed
    return True
