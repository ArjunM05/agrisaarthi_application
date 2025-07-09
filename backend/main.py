from flask import jsonify, request
from decimal import Decimal
from flask_cors import CORS
from datetime import datetime
import bcrypt

from config import app,db


cors=CORS(app,origins='*')

#--------------------------------------------------------------------

def register_user(name: str, email: str, phone: str, password: str, user_type: str, location: str) -> bool:
    """
    Registers a new user in the system.

    Args:
        name (str): The user's name.
        email (str): The user's email (must be unique).
        phone (str): The user's phone number (must be unique).
        password (str): The password for the account.
        user_type (str): The type of user (e.g., 'farmer', 'supplier', 'admin').
        location (str): The user's initial location string.
    """
    if not email or not password or not user_type:
        print("Error: Email, password, and user type are required for registration.")
        return False

    # Check for existing user by email
    existing_email = db.table('users').select('id').eq('email', email).execute()
    if existing_email.data:
        print(f"Error: User with email '{email}' already exists.")
        return False
    # Check for existing user by phone
    existing_phone = db.table('users').select('id').eq('phone', phone).execute()
    if existing_phone.data:
        print(f"Error: User with phone '{phone}' already exists.")
        return False

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        result = db.table('users').insert({
            'name': name,
            'email': email,
            'phone': phone,
            'password': hashed_password,
            'role': user_type,
            'district': location
        }).execute()
        if user_type.lower == 'farmer':
            result_details = db.table('farmer_details').insert({
                'user_id': result.data[0]['id'],
                'farm_size': 0
            }).execute()
        elif user_type.lower == 'supplier':
            result_details = db.table('supplier_details').insert({
                'user_id': result.data[0]['id'],
                'shop_name': '',
                'address': '',
                'latitude': 0,
                'longitude': 0
            }).execute()
        if result.data and result_details.data:
            print(f"User '{email}' registered successfully as {user_type}.")
            return True
        else:
            print(f"Error: Failed to insert user into database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during registration: {e}")
        return False

def login_user(email: str, password: str) -> bool:
    """
    Authenticates a user based on email and password.

    Args:
        email (str): The user's email.
        password (str): The plaintext password provided by the user.
    """
    try:
        result = db.table('users').select('password').eq('email', email).limit(1).execute()
        if not result.data:
            print(f"Login failed: Invalid email.")
            return False
        user = result.data[0]
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            print(f"User '{email}' logged in successfully.")
            return True
        else:
            print(f"Login failed: Invalid password.")
            return False
    except Exception as e:
        print(f"An error occurred during login: {e}")
        return False

def update_user_profile(user_id: int, name: str, phone: str, location: str) -> bool:
    """
    Updates the profile information for a given user.

    Args:
        user_id (int): The ID of the user to update.
        name (str): The new name for the user.
        phone (str): The new phone number for the user.
        location (str): The new location string for the user.
    """
    user_result = db.table('users').select('id').eq('id', user_id).limit(1).execute()
    if not user_result.data:
        print(f"Error: User with ID {user_id} not found.")
        return False

    # Check for phone uniqueness (if phone is being updated)
    if phone is not None:
        phone_result = db.table('users').select('id').eq('phone', phone).neq('id', user_id).limit(1).execute()
        if phone_result.data:
            print(f"Error: Phone number '{phone}' already in use by another user.")
            return False

    update_fields = {}
    if name is not None:
        update_fields['name'] = name
    if phone is not None:
        update_fields['phone'] = phone
    if location is not None:
        update_fields['location'] = location

    if not update_fields:
        print(f"No fields to update for user ID {user_id}.")
        return False

    try:
        result = db.table('users').update(update_fields).eq('id', user_id).execute()
        if result.data:
            print(f"User ID {user_id} profile updated successfully.")
            return True
        else:
            print(f"Error: Failed to update user profile in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during profile update: {e}")
        return False

def update_supplier_details(supplier_id: int, shop_name: str, address: str, latitude: Decimal, longitude: Decimal) -> bool:
    """
    Updates the supplier information.

    Args:
        supplier_id (int): The ID of the supplier to update.
        shop_name (str): The name of the supplier's shop.
        address (str): The address of the shop.
        latitude (Decimal): The latitude of the location of the shop.
        longitude (Decimal): The longitude of the location of the shop.
    """
    supplier_result = db.table('users').select('id').eq('id', supplier_id).limit(1).execute()
    if not supplier_result.data:
        print(f"Error: Supplier with ID {supplier_id} not found.")
        return False

    update_fields = {}
    if shop_name is not None:
        update_fields['shop_name'] = shop_name
    if address is not None:
        update_fields['address'] = address
    if latitude is not None and longitude is not None:
        update_fields['latitude'] = float(latitude)
        update_fields['longitude'] = float(longitude)

    if not update_fields:
        print(f"No fields to update for supplier ID {supplier_id}.")
        return False

    try:
        result = db.table('users').update(update_fields).eq('id', supplier_id).execute()
        if result.data:
            print(f"User ID {supplier_id} profile updated successfully.")
            return True
        else:
            print(f"Error: Failed to update supplier profile in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during supplier profile update: {e}")
        return False

def update_farmer_details(farmer_id: int, farm_size: Decimal) -> bool:
    """
    Updates the farmer information.

    Args:
        farmer_id (int): The ID of the farmer to update.
        farm_size (Decimal): The land area of the farm.
    """
    farmer_result = db.table('users').select('id').eq('id', farmer_id).limit(1).execute()
    if not farmer_result.data:
        print(f"Error: Farmer with ID {farmer_id} not found.")
        return False

    update_fields = {}
    if farm_size is not None:
        update_fields['farm_size'] = float(farm_size)

    if not update_fields:
        print(f"No fields to update for farmer ID {farmer_id}.")
        return False

    try:
        result = db.table('users').update(update_fields).eq('id', farmer_id).execute()
        if result.data:
            print(f"User ID {farmer_id} profile updated successfully.")
            return True
        else:
            print(f"Error: Failed to update farmer profile in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during farmer profile update: {e}")
        return False
    
def update_admin_details(admin_id: int, admin_level: int, department: str) -> bool:
    """
    Updates the admin information.

    Args:
        admin_id (int): The ID of the admin to update.
        admin_level (int): The authorization level of the admin.
        department (str): The department in which admin is working.
    """
    admin_result = db.table('users').select('id').eq('id', admin_id).limit(1).execute()
    if not admin_result.data:
        print(f"Error: Admin with ID {admin_id} not found")
        return False

    update_fields = {}
    if admin_level is not None:
        update_fields['admin_level'] = admin_level
    if department is not None:
        update_fields['department'] = department

    if not update_fields:
        print(f"No fields to update for admin ID {admin_id}.")
        return False

    try:
        result = db.table('users').update(update_fields).eq('id', admin_id).execute()
        if result.data:
            print(f"User ID {admin_id} profile updated successfully.")
            return True
        else:
            print(f"Error: Failed to update admin profile in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during admin profile update: {e}")
        return False

def submit_feedback(user_id: int, rating: int, comments: str) -> bool:
    """
    Submits new feedback or a testimonial.

    Args:
        user_id (int): The ID of the user submitting feedback.
        rating (int): The rating given (e.g., 1-5).
        comments (str): The feedback comments.
    """
    if not isinstance(rating, int) or not (1 <= rating <= 5):
        print("Error: Rating must be between 1 and 5.")
        return False

    try:
        result = db.table('feedback').insert({
            'user_id': user_id,
            'rating': rating,
            'comments': comments
        }).execute()
        if result.data:
            print(f"Feedback submitted successfully.")
            return True
        else:
            print(f"Error: Failed to submit feedback to database.")
            return False
    except Exception as e:
        print(f"Error submitting feedback: {e}")
        return False
    
def log_sms_interaction(user_phone: str, query_type: str, message: str, response: str) -> bool:
    """
    Logs an SMS interaction, including the query, message, and response.

    Args:
        user_phone (str): The phone number of the user involved in the SMS interaction.
        query_type (str): The type of query or interaction (e.g., 'pest_detection', 'weather').
        message (str): The content of the SMS message.
        response (str, optional): The response sent back, if any. Defaults to None.
    """
    if not user_phone or not query_type or not message:
        print("Error: User phone, query type, and message are required for SMS log.")
        return False

    try:
        result = db.table('sms_logs').insert({
            'user_phone': user_phone,
            'query_type': query_type,
            'message': message,
            'response': response
        }).execute()
        if result.data:
            print(f"SMS interaction logged for {user_phone}.")
            return True
        else:
            print(f"Error: Failed to log SMS interaction to database.")
            return False
    except Exception as e:
        print(f"Error logging SMS interaction: {e}")
        return False

def log_pest_detection(user_id: int, image_url: str, pest_name: str, confidence: float, dosage: int, xai_path: str = "") -> bool:
    """
    Logs the results of a pest detection inference.

    Args:
        user_id (int): The ID of the user who submitted the image.
        image_url (str): The URL or path to the image used for inference.
        pest_name (str): The name of the detected pest.
        confidence (float): The confidence score of the detection (0.0 to 1.0).
        dosage (int): The dosage of pesticide to be administered.
        xai_path (str, optional): URL or path to the Explainable AI visualization. Defaults to None.
    """
    if not user_id or not image_url or not pest_name or confidence is None or dosage is None:
        print("Error: User ID, image URL, pest name, dosage, and confidence are required.")
        return False
    if not (0.0 <= confidence <= 1.0):
        print("Error: Confidence must be a float between 0.0 and 1.0.")
        return False

    try:
        data = {
            'user_id': user_id,
            'image_url': image_url,
            'pest_name': pest_name,
            'confidence': confidence,
            'dosage': dosage
        }
        if xai_path is not None:
            data['xai_path'] = xai_path
        result = db.table('pest_inference_results').insert(data).execute()
        if result.data:
            print(f"Pest detection logged for User ID {user_id}.")
            return True
        else:
            print(f"Error: Failed to log pest detection to database.")
            return False
    except Exception as e:
        print(f"Error logging pest detection: {e}")
        return False
    
def update_weather_data(location: str, weather_data: dict, schemes: str) -> bool:
    """
    Updates or inserts weather data and associated schemes for a specific location in the cache.

    Args:
        location (str): The geographical location (e.g., city name, coordinates string).
        weather_data (dict): The weather data in JSON format (will be stored as JSONB).
        schemes (str): Associated farming schemes or recommendations.
    """
    if not location or not weather_data or not schemes:
        print("Error: Location, weather data and schemes are required.")
        return False
    try:
        result = db.table('weather_scheme_cache').upsert({
            'location': location,
            'weather_data': weather_data,
            'schemes': schemes
        }, on_conflict="location").execute()
        if result.data:
            print(f"Weather data updated for {location}.")
            return True
        else:
            print(f"Error: Failed to update/insert weather data in database.")
            return False
    except Exception as e:
        print(f"Error updating/inserting weather data cache: {e}")
        return False

def get_weather_data(location: str):
    """
    Retrieves cached weather data for a given location.

    Args:
        location (str): The geographical location (e.g., city name, coordinates string).
    """
    try:
        result = db.table('weather_scheme_cache').select('*').eq('location', location).limit(1).execute()
        if result.data:
            return result.data[0]
        else:
            return None
    except Exception as e:
        print(f"Error retrieving weather data: {e}")
        return None

def get_schemes_by_location(location: str):
    """
    Retrieves schemes for a given location.

    Args:
        location (str): The location string.
    """
    result = db.table('weather_scheme_cache').select('schemes').eq('location', location).limit(1).execute()
    if result.data:
        return result.data[0].get('schemes')
    return None

def get_user_name(user_id=None, email=None):
    """
    Retrieves the name of a user by user_id or email.

    Args:
        user_id (int, optional): The user's ID.
        email (str, optional): The user's email.
    """
    if user_id is not None:
        result = db.table('users').select('name').eq('id', user_id).limit(1).execute()
    elif email is not None:
        result = db.table('users').select('name').eq('email', email).limit(1).execute()
    else:
        return None
    if result.data:
        return result.data[0]['name']
    return None

def get_last_4_pest_images(user_id) -> list:
    """
    Retrieves the image URLs of the last 4 pests searched by a user.

    Args:
        user_id (int): The user's ID.
    """
    result = db.table('pest_inference_results').select('image_url').eq('user_id', user_id).order('prediction_time', desc=True).limit(4).execute()
    if result.data:
        return [row['image_url'] for row in result.data]
    return []

def get_last_contacted_supplier(user_id):
    """
    Retrieves the last contacted supplier for a user from sms_logs.

    Args:
        user_id (int): The user's ID.
    """
    # Assuming 'query_type' or 'message' can be used to filter supplier contacts
    result = db.table('sms_logs').select('user_phone').eq('user_id', user_id).eq('query_type', 'supplier_contact').order('timestamp', desc=True).limit(1).execute()
    if result.data:
        return result.data[0]['user_phone']
    return None

#-----------------------------------------------------------------------------------------------------------



@app.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    user_type = data.get('role')
    location = data.get('district')

    if register_user(name, email, phone, password, user_type, location):
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"error": "Registration failed"}), 400

@app.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if login_user(email, password):
        # Session token???
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/profile/<int:user_id>', methods=['PUT'])
def update_profile_route(user_id):
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    location = data.get('location')

    if update_user_profile(user_id, name, phone, location):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

    
@app.route('/supplier_details/<int:supplier_id>', methods=['PUT'])
def update_supplier_details_route(supplier_id):
    data = request.get_json()
    shop_name = data.get('shopName')
    address = data.get('address')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if update_supplier_details(supplier_id, shop_name, address, latitude, longitude):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

@app.route('/farmer_details/<int:farmer_id>', methods=['PUT'])
def update_farmer_details_route(farmer_id):
    data = request.get_json()
    farm_size=data.get('farmSize')

    if update_farmer_details(farmer_id, farm_size):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

@app.route('/admin_details/<int:admin_id>',methods=['PUT'])
def update_admin_details_route(admin_id):
    data = request.get_json()
    admin_level = data.get('admin_level')
    department = data.get('department')

    if update_admin_details(admin_id, admin_level, department):
        return jsonify({"message": "Profile updated successfully"}),200
    else:
        return jsonify({"error": "Profile update failed"}), 400

@app.route('/feedback', methods=['POST'])
def feedback_route():
    data = request.get_json()
    user_id = data.get('user_id')
    rating = data.get('rating')
    comments = data.get('comments')

    if submit_feedback(user_id, rating, comments):
        return jsonify({"message": "Feedback submitted"}), 201
    else:
        return jsonify({"error": "Failed to submit feedback"}), 400
    
@app.route('/sms/log', methods=['POST'])
def sms_log_route():
    data = request.get_json()
    user_phone = data.get('user_phone')
    query_type = data.get('query_type')
    message = data.get('message')
    response = data.get('response') # Response can be optional

    if log_sms_interaction(user_phone, query_type, message, response):
        return jsonify({"message": "SMS log recorded"}), 201
    else:
        return jsonify({"error": "Failed to record SMS log"}), 400

@app.route('/pest_detection/log', methods=['POST'])
def pest_detection_log_route():
    data = request.get_json()
    user_id = data.get('user_id')
    image_url = data.get('image_url')
    pest_name = data.get('pest_name')
    confidence = data.get('confidence')
    xai_path = data.get('xai_path')
    dosage = data.get('dosage')

    if log_pest_detection(user_id, image_url, pest_name, confidence, xai_path):
        return jsonify({"message": "Pest detection logged"}), 201
    else:
        return jsonify({"error": "Failed to log pest detection"}), 400
    
@app.route('/weather_cache', methods=['POST'])
def weather_cache_route():
    data = request.get_json()
    location = data.get('location')
    weather_data = data.get('weather_data')
    schemes = data.get('schemes')

    if update_weather_data(location, weather_data, schemes):
        return jsonify({"message": "Weather cache updated"}), 201
    else:
        return jsonify({"error": "Failed to update weather cache"}), 400

@app.route('/weather_cache/<location>', methods=['GET'])
def get_weather_cache_route(location):
    cache_entry = get_weather_data(location)
    if cache_entry:
        return jsonify({
            "location": cache_entry.get("location"),
            "weather_data": cache_entry.get("weather_data"),
            "schemes": cache_entry.get("schemes"),
            "updated_at": cache_entry.get("updated_at")
        }), 200
    else:
        return jsonify({"error": "Location not found in cache"}), 404


@app.route('/schemes/<location>', methods=['GET'])
def schemes_route(location):
    schemes = get_schemes_by_location(location)
    if schemes:
        return jsonify({'schemes': schemes}), 200
    else:
        return jsonify({'error': 'Schemes not found'}), 404

@app.route('/user_name', methods=['POST'])
def user_name_route():
    data = request.get_json()
    user_id = data.get('user_id')
    email = data.get('email')
    name = get_user_name(user_id, email)
    if name:
        return jsonify({'name': name}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/last_pest_images', methods=['POST'])
def last_pest_images_route():
    data = request.get_json()
    user_id = data.get('user_id')
    images = get_last_4_pest_images(user_id)
    return jsonify({'images': images}), 200

@app.route('/last_supplier', methods=['POST'])
def last_supplier_route():
    data = request.get_json()
    user_id = data.get('user_id')
    supplier = get_last_contacted_supplier(user_id)
    if supplier:
        return jsonify({'supplier': supplier}), 200
    else:
        return jsonify({'error': 'No supplier found'}), 404

#-------------------------------------------------------------------------------------------------

if __name__=="__main__":
    app.run(debug=True,host='0.0.0.0',port=5001)