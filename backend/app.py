import jwt, os,time
import psutil
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO,emit
from screenmanager import ScreenManager
from threading import Thread
from validate import validate_book, validate_email_and_password, validate_user
from models.models import User
from auth_middleware import token_required
from routes.sms_routes import sms_bp
from routes.country_operator_routes import operator_bp

load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")
SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'
app.config['SECRET_KEY'] = SECRET_KEY
app.register_blueprint(sms_bp, url_prefix='/api')
app.register_blueprint(operator_bp, url_prefix='/api/operators')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('server_message', {'status': 'Connected to WebSocket'})

@app.route('/test_emit', methods=['GET'])
def trigger_emit():
    """Trigger a test WebSocket emit."""
    print('Sending test WebSocket message...')
    socketio.emit('sms_update', {'status': 'Test message from backend'})
    return jsonify({"message": "Test emit triggered"}), 200

def emit_system_stats():
    while True:
        # Get memory and CPU usage stats
        free_ram = psutil.virtual_memory().available / (1024 ** 2)  
        total_ram = psutil.virtual_memory().total / (1024 ** 2)   
        cpu_usage = psutil.cpu_percent()                           
        
        socketio.emit('system_stats', {
            'free_ram': f"{free_ram:.2f}",   # Format to two decimal places
            'total_ram': f"{total_ram:.2f}", # Format to two decimal places
            'cpu_usage': f"{cpu_usage:.2f}"  # Format to two decimal places
        })
        
        time.sleep(1)

# Start background thread for system stats emission
thread = Thread(target=emit_system_stats)
thread.daemon = True
thread.start()


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/users/", methods=["POST"])
def add_user():
    try:
        user = request.json
        if not user:
            return jsonify({
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }), 400
        is_validated = validate_user(**user)
        if is_validated is not True:
            return jsonify({"message":is_validated, "data":None, "error":is_validated}), 400
        user = User().create(**user)
        if not user:
            return {
                "message": "User already exists",
                "error": "Conflict",
                "data": None
            }, 409
        return {
            "message": "Successfully created new user",
            "data": user
        }, 201
    except Exception as e:
        return {
            "message": "Something went wrong",
            "error": str(e),
            "data": None
        }, 500

@app.route("/users/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return {
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }, 400
        # validate input
        is_validated = validate_email_and_password(data.get('email'), data.get('password'))
        if is_validated is not True:
            return jsonify({"message":"Check your email and password again", "data":None, "error":is_validated}), 400
        user = User().login(
            data["email"],
            data["password"]
        )
        if user:
            try:
                # token should expire after 24 hrs
                user["token"] = jwt.encode(
                    {"user_id": user["_id"]},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
                return {
                    "message": "Successfully fetched auth token",
                    "data": user
                },200
            except Exception as e:
                return {
                    "error": "Something went wrong",
                    "message": str(e)
                }, 500
        return {
            "message": "Invalid email or password",
            "data": None,
            "error": "Unauthorized"
        }, 404
    except Exception as e:
        return {
                "message": "Something went wrong!",
                "error": str(e),
                "data": None
        }, 500


@app.route("/users/", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({
        "message": "successfully retrieved user profile",
        "data": current_user
    })

@app.route("/users/", methods=["PUT"])
@token_required
def update_user(current_user):
    try:
        user = request.json
        if user.get("name"):
            user = User().update(current_user["_id"], user["name"])
            return jsonify({
                "message": "successfully updated account",
                "data": user
            }), 201
        return {
            "message": "Invalid data, you can only update your account name!",
            "data": None,
            "error": "Bad Request"
        }, 400
    except Exception as e:
        return jsonify({
            "message": "failed to update account",
            "error": str(e),
            "data": None
        }), 400

@app.route("/users/", methods=["DELETE"])
@token_required
def disable_user(current_user):
    try:
        User().disable_account(current_user["_id"])
        return jsonify({
            "message": "successfully disabled acount",
            "data": None
        }), 204
    except Exception as e:
        return jsonify({
            "message": "failed to disable account",
            "error": str(e),
            "data": None
        }), 400

@app.route("/session/start", methods=["POST"])
@token_required
def start_session(current_user):
    countries=['india','usa','canada']
    operators={
        'india':['Jio','Airtel','VI','BSNL'],
        'canada':['Rogers','Telus','Bell'],
        'usa':['Verizon','TMobile','AT&T','Mint'],
        }
    try:
        data = request.json
        country = data.get("country")
        operator = data.get("operator")
        program = data.get("program")
        if country is None or country not in countries:
            return {
            "message": "Country name is Required","error": "Bad Request" }, 400
        if program is None:
            return {
            "message": "Program name is Required","error": "Bad Request" }, 400
        
        if operator is None or operator not in operators[country]:
            return {
            "message": "Invalid data, Program is required",
            "data": None,
            "error": "Bad Request"
        }, 400
        session_name=program+"_"+country+"_"+operator
        program=program+".py"
        # return jsonify({"message": "nekgnlekg"});
        message = ScreenManager.start_session(session_name, program)
        
        verify=ScreenManager.is_session_running(session_name)
        if verify is True:
            if message is True:
                return jsonify({"response": True,"session_name":session_name,"message":"Session created successfully"}),200
            return jsonify({"response": False,"session_name":session_name,"message":message}),200
        
        return jsonify({"message": message,"error":"Service unavailable"}),503
    except Exception as e:
        return jsonify({
            "message": "Failed to start session",
            "error": str(e),
            "data": None
        }), 400
    

@app.route("/session/stop", methods=["POST"])
@token_required
def stop_session(current_user):
    try:
        data = request.json
        session_name = data.get("session_name")
        if session_name is None:
            return jsonify({
            "message": "Invalid data, Session Name is required",
            "data": None,
            "error": "Bad Request"
        }), 400
        message = ScreenManager.stop_session(session_name)
        if message is True:
            return jsonify({"message": "Stopped successfully","response":True,"session_name":session_name}),200
        return jsonify({"message": message}),400
    except Exception as e:
        return jsonify({
            "message": str(e),
            "error": str(e),
            "data": None
        }), 400
    

@app.route("/session", methods=["GET"])
def list_sessions():
    try:
        sessions = ScreenManager.list_sessions()
        return jsonify({"sessions": sessions})
    except Exception as e:
        return jsonify({
            "message": "failed to update account",
            "error": str(e),
            "data": None
        }), 400
     


@app.errorhandler(403)
def forbidden(e):
    return jsonify({
        "message": "Forbidden",
        "error": str(e),
        "data": None
    }), 403

@app.errorhandler(404)
def forbidden(e):
    return jsonify({
        "message": "Endpoint Not Found",
        "error": str(e),
        "data": None
    }), 404


if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, debug=True)

