from decimal import Decimal
import bcrypt
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import random
import string
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import weatherapi
from weatherapi.rest import ApiException
import uuid

from config import db

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDGRID_SENDER_EMAIL = os.getenv("SENDGRID_SENDER_EMAIL")

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

if not SENDGRID_API_KEY:
    raise ValueError("SENDGRID_API_KEY not found in environment variables.")
if not SENDGRID_SENDER_EMAIL:
    raise ValueError("SENDGRID_SENDER_EMAIL not found in environment variables.")

configuration = weatherapi.Configuration()
configuration.api_key['key'] = WEATHER_API_KEY

def register_user(name: str, email: str, phone: str, password: str, user_type: str, location: str):
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
        return {"status": "error", "code": 1, "message": "Email, password, and user type are required for registration"}

    existing_email = db.table('users').select('id').eq('email', email).execute()
    if existing_email.data:
        print(f"Error: User with email '{email}' already exists.")
        return {"status": "error", "code": 2, "message": "User with this email already exists"}
    
    existing_phone = db.table('users').select('id').eq('phone', phone).execute()
    if existing_phone.data:
        print(f"Error: User with phone '{phone}' already exists.")
        return {"status": "error", "code": 3, "message": "User with this phone number already exists"}

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
        result_details = None
        if user_type.lower() == 'farmer':
            result_details = db.table('farmer_details').insert({
                'farmer_id': result.data[0]['id'],
                'farm_size': 0
            }).execute()
        elif user_type.lower() == 'supplier':
            result_details = db.table('supplier_details').insert({
                'supplier_id': result.data[0]['id'],
                'shop_name': '',
                'address': '',
                'latitude': 0,
                'longitude': 0,
                'approved': False,
                'service_areas': []
            }).execute()
        
        if result.data and (result_details is None or result_details.data):
            print(f"User '{email}' registered successfully as {user_type}.")
            return {"status": "success", "code": 4, "message": "User registered successfully"}
        else:
            print(f"Error: Failed to insert user into database.")
            return {"status": "error", "code": 5, "message": "Failed to insert user into database"}
    except Exception as e:
        print(f"An unexpected error occurred during registration: {e}")
        return {"status": "error", "code": 6, "message": f"Error: {str(e)}"}


def login_user(email: str, password: str):
    try:
        result = db.table('users').select('id, name, phone, password, role, district').eq('email', email).limit(1).execute()
        if not result.data:
            return {"status": "error", "code": 1, "message": "Invalid email or password"}

        user = result.data[0]
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return {
                "status": "success",
                "user_id": user['id'],
                "name": user['name'],
                "email": email,
                "phone": user['phone'],
                "role": user['role'],
                "district": user['district'],
                "message": f"User '{email}' logged in successfully"
            }
        else:
            return {"status": "error", "code": 2, "message": "Invalid email or password"}

    except Exception as e:
        return {"status": "error", "code": 3, "message": f"Error: {str(e)}"}


def update_user_profile(user_id, name=None, phone=None, district=None):
    """
    Updates the profile information for a given user.

    Args:
        user_id (int): The ID of the user to update.
        name (str, optional): The new name for the user.
        phone (str, optional): The new phone number for the user.
        district (str, optional): The new district for the user.
    """
    user_result = db.table('users').select('id').eq('id', user_id).limit(1).execute()
    if not user_result.data:
        print(f"Error: User with ID {user_id} not found.")
        return False
    
    update_fields = {}
    if name is not None:
        update_fields['name'] = name
    if phone is not None:
        update_fields['phone'] = phone
    if district is not None:
        update_fields['district'] = district

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

def update_supplier_details(supplier_id, shop_name=None, address=None, latitude=None, longitude=None, approved=None, service_areas=None):
    """
    Updates the supplier information.

    Args:
        supplier_id (int): The ID of the supplier to update.
        shop_name (str, optional): The name of the supplier's shop.
        address (str, optional): The address of the shop.
        latitude (float, optional): The latitude of the location of the shop.
        longitude (float, optional): The longitude of the location of the shop.
        approved (bool, optional): Whether the supplier is approved.
        service_areas (list, optional): List of service areas.
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
    if latitude is not None:
        update_fields['latitude'] = float(latitude)
    if longitude is not None:
        update_fields['longitude'] = float(longitude)
    if approved is not None:
        update_fields['approved'] = approved
    if service_areas is not None:
        update_fields['service_areas'] = service_areas

    if not update_fields:
        print(f"No fields to update for supplier ID {supplier_id}.")
        return False

    try:
        result = db.table('supplier_details').update(update_fields).eq('supplier_id', supplier_id).execute()
        if result.data:
            print(f"Supplier ID {supplier_id} details updated successfully.")
            return True
        else:
            print(f"Error: Failed to update supplier details in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during supplier details update: {e}")
        return False

def update_farmer_details(farmer_id, farm_size=None, main_crop=None, irrigation_type=None):
    """
    Updates the farmer information.

    Args:
        farmer_id (int): The ID of the farmer to update.
        farm_size (float, optional): The land area of the farm.
        main_crop (str, optional): The main crop grown by the farmer.
        irrigation_type (str, optional): The type of irrigation used.
    """
    farmer_result = db.table('users').select('id').eq('id', farmer_id).limit(1).execute()
    if not farmer_result.data:
        print(f"Error: Farmer with ID {farmer_id} not found.")
        return False

    update_fields = {}
    if farm_size is not None:
        update_fields['farm_size'] = float(farm_size)
    if main_crop is not None:
        update_fields['main_crop'] = main_crop
    if irrigation_type is not None:
        update_fields['irrigation_type'] = irrigation_type

    if not update_fields:
        print(f"No fields to update for farmer ID {farmer_id}.")
        return False

    try:
        result = db.table('farmer_details').update(update_fields).eq('farmer_id', farmer_id).execute()
        if result.data:
            print(f"Farmer ID {farmer_id} details updated successfully.")
            return True
        else:
            print(f"Error: Failed to update farmer details in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during farmer details update: {e}")
        return False
    
def update_admin_details(admin_id: str, admin_level: int, department: str):
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

def submit_feedback(user_id: str, rating: int, comments: str):
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
    
def log_sms_interaction(user_phone: str, query_type: str, message: str, response: str):
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

def log_pest_detection(user_id: str, image_url: str, pest_name: str, confidence: float, dosage: int, xai_path: str = ""):
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
    
def update_weather_data(location: str):
    """
    Updates or inserts weather data and associated schemes for a specific location in the cache.

    Args:
        location (str): The geographical location (e.g., city name, coordinates string).
    """
    if not location:
        print("Error: Location is required.")
        return False
    try:
        current_time = datetime.now().replace(tzinfo=None)
        response = db.table('weather_scheme_cache').select('weather_data,updated_at').eq('location', location).limit(1).execute()
        if response.data:
            stored_time = datetime.fromisoformat(response.data[0]['updated_at'])
            if stored_time.tzinfo is not None:
                stored_time = stored_time.replace(tzinfo=None)
            if current_time - stored_time < timedelta(minutes=30):
                print(f"Weather data is up to date for {location}.")
                return response.data[0]
        else:
            api_instance = weatherapi.APIsApi(weatherapi.ApiClient(configuration))
            try:
                api_response = api_instance.forecast_weather(q=location, days=3, aqi='yes', alerts='yes')
                result = db.table('weather_scheme_cache').upsert({
                    'location': location,
                    'weather_data': api_response,
                    'updated_at': datetime.now().replace(tzinfo=None).isoformat()
                }, on_conflict="location").execute()
                if result.data:
                    print(f"Weather data updated for {location}.")
                    return result.data[0]
                else:
                    print(f"Error: Failed to update/insert weather data in database.")
                    return None
            except ApiException as e:
                print("Exception when calling APIsApi->forecast_weather: %s\n" % e)
                return None
    except Exception as e:
        print(f"Error getting weather data cache: {e}")
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

def get_last_4_pest_images(user_id: str):
    """
    Retrieves the image URLs of the last 4 pests searched by a user.

    Args:
        user_id (int): The user's ID.
    """
    result = db.table('pest_inference_results').select('image_url').eq('user_id', user_id).order('prediction_time', desc=True).limit(4).execute()
    if result.data:
        return [row['image_url'] for row in result.data]
    return []


def get_pest_history(user_id: str):
    """
    Retrieves the pest detection history for a user.

    Args:
        user_id (int): The user's ID.
    """
    try:
        result = db.table('pest_inference_results').select('image_url, pest_name, pesticide, dosage').eq('user_id', user_id).order('prediction_time', desc=True).execute()
        if result.data:
            return [
                {
                    'img_url': row['image_url'],
                    'pest_name': row['pest_name'],
                    'pesticide':row['pesticide'],
                    'dosage': row['dosage']
                }
                for row in result.data
            ]
        return []
    except Exception as e:
        print(f"Error retrieving pest history: {e}")
        return []

def get_last_contacted_suppliers(farmer_id: str):
    """
    Retrieves all suppliers contacted by a farmer.
    Args:
        farmer_id (int): The farmer's ID.
    """
    try:
        result = db.table('suppliers_contacted').select('supplier_id, pesticide_name, contact_time').eq('farmer_id', farmer_id).order('contact_time', desc=True).execute()
        if not result.data:
            return []
        contacts = []
        for row in result.data:
            supplier_id = row.get('supplier_id')
            supplier_result = db.table('users').select('name, phone, email').eq('id', supplier_id).eq('role', 'supplier').limit(1).execute()
            if not supplier_result.data:
                print(f"Error: Supplier with ID {supplier_id} not found.")
                return []
            supplier = supplier_result.data[0]
            supplier_detail=db.table('supplier_details').select('shop_name, address').eq('supplier_id', supplier_id).limit(1).execute()
            if not supplier_detail.data:
                print(f"Error: Supplier details with ID {supplier_id} not found.")
                return []
            supplier_details=supplier_detail.data[0]
            contacts.append({
                'supplier_id': supplier_id,
                'supplier_name': supplier['name'],
                'shop_name': supplier_details['shop_name'],
                'address': supplier_details['address'],
                'pesticide': row.get('pesticide_name'),
                'contact_time': row.get('contact_time')
            })
        return contacts
    except Exception as e:
        print(f"Error retrieving contacted suppliers: {e}")
        return []

def get_supplier_inventory(supplier_id):
    """
    Retrieves supplier inventory information.

    Args:
        supplier_id: The supplier's ID (string UUID).
    """
    try:
        result = db.table('pesticide_listings').select('*').eq('supplier_id', supplier_id).execute()
        
        if result.data:
            return result.data
        return []
    except Exception as e:
        print(f"Error retrieving supplier inventory: {e}")
        return []

def update_inventory(price: float, stock: int, pesticide: str, name: str, supplier_id: str):
    """
    Updates the inventory information of the supplier.

    Args:
        price (float): The price of the pesticide.
        stock (int): The available stock quantity.
        pesticide (str): The name of the pesticide.
        name (str): The supplier's name.
        supplier_id: The supplier's ID (string UUID).
    """
    try:
        supplier_result = db.table('users').select('id').eq('id', supplier_id).eq('role', 'supplier').limit(1).execute()
        if not supplier_result.data:
            print(f"Error: Supplier with ID {supplier_id} not found.")
            return False

        # First check if the record exists
        existing_record = db.table('pesticide_listings').select('*').eq('supplier_id', supplier_id).eq('pesticide', pesticide).execute()
        
        if existing_record.data:
            # Update existing record
            result = db.table('pesticide_listings').update({
                'price': price,
                'name': name,
                'stock': stock
            }).eq('supplier_id', supplier_id).eq('pesticide', pesticide).execute()
        else:
            # Insert new record
            result = db.table('pesticide_listings').insert({
                'supplier_id': supplier_id,
                'pesticide': pesticide,
                'price': price,
                'name': name,
                'stock': stock
            }).execute()
        
        if result.data:
            print(f"Inventory updated successfully for supplier ID {supplier_id}.")
            return True
        else:
            print(f"Error: Failed to update inventory in database.")
            return False
    except Exception as e:
        print(f"An unexpected error occurred during inventory update: {e}")
        return False

def get_supplier_details(pesticide_name: str):
    """
    Returns a list of suppliers who have the given pesticide.

    Args:
        pesticide_name (str): The name of the pesticide.
    """
    try:
        result = db.table('pesticide_listings').select('supplier_id, price, stock').eq('pesticide', pesticide_name).execute()
        if not result.data:
            return []
        suppliers = []
        for row in result.data:
            supplier_id = row.get('supplier_id')
            supplier_result = db.table('users').select('name').eq('id', supplier_id).eq('role', 'supplier').limit(1).execute()
            if not supplier_result.data:
                print(f"Error: Supplier with ID {supplier_id} not found.")
                return []
            supplier = supplier_result.data[0]
            supplier_detail=db.table('supplier_details').select('shop_name, address').eq('supplier_id', supplier_id).limit(1).execute()
            if not supplier_detail.data:
                print(f"Error: Supplier details with ID {supplier_id} not found.")
                return []
            supplier_details=supplier_detail.data[0]
            suppliers.append({
                'supplier_id': supplier_id,
                'supplier_name': supplier['name'],
                'shop_name': supplier_details['shop_name'],
                'address': supplier_details['address'],
                'price': row.get('price'),
                'stock': row.get('stock')
            })
        return suppliers
    except Exception as e:
        print(f"Error retrieving supplier details: {e}")
        return []

def call_supplier(supplier_id: str, farmer_id: str, pesticide: str):
    """
    Returns the phone number of the supplier with the given supplier_id.

    Args:
        supplier_id (int): The supplier's ID.
    """
    try:
        result = db.table('users').select('phone').eq('id', supplier_id).eq('role', 'supplier').limit(1).execute()
        if not result.data: 
            print(f"Error: Supplier with ID {supplier_id} not found.")
            return None
        contact_details={
            'farmer_id': farmer_id,
            'supplier_id': supplier_id,
            'pesticide_name': pesticide
        }
        db.table('suppliers_contacted').insert(contact_details).execute()
        print(f"Supplier {supplier_id} contacted farmer {farmer_id} for pesticide {pesticide}.")
        return result.data[0]['phone']
    except Exception as e:
        print(f"Error retrieving supplier phone: {e}")
        return None

def get_user_info(user_id):
    """
    Retrieves all user info and role-specific details.
    Args:
        user_id (int): The user's ID.
    """
    try:
        user_result = db.table('users').select('*').eq('id', user_id).limit(1).execute()
        if not user_result.data:
            return None
        user = user_result.data[0]
        role = user.get('role', '').lower()
        details = None
        if role == 'farmer':
            details_result = db.table('farmer_details').select('*').eq('farmer_id', user_id).limit(1).execute()
            if details_result.data:
                details = details_result.data[0]
            else:
                # Create default farmer details if none exist
                details = {
                    'farm_size': None,
                    'main_crop': None,
                    'irrigation_type': None
                }
            user['details'] = details
        elif role == 'supplier':
            details_result = db.table('supplier_details').select('*').eq('supplier_id', user_id).limit(1).execute()
            if details_result.data:
                details = details_result.data[0]
            else:
                # Create default supplier details if none exist
                details = {
                    'shop_name': None,
                    'address': None,
                    'latitude': None,
                    'longitude': None,
                    'approved': False,
                    'service_areas': []
                }
            user['details'] = details
        elif role == 'admin':
            details_result = db.table('admin_details').select('*').eq('admin_id', user_id).limit(1).execute()
            if details_result.data:
                details = details_result.data[0]
            user['details'] = details
        return user
    except Exception as e:
        print(f"Error retrieving user info: {e}")
        return None

def delete_account(user_id):
    """
    Deletes a user account and related details.
    Args:
        user_id (int): The user's ID.
    """
    try:
        user_result = db.table('users').select('id, role').eq('id', user_id).limit(1).execute()
        if not user_result.data:
            return False
        role = user_result.data[0].get('role', '').lower()
        if role == 'farmer':
            db.table('farmer_details').delete().eq('farmer_id', user_id).execute()
        elif role == 'supplier':
            db.table('supplier_details').delete().eq('supplier_id', user_id).execute()
        elif role == 'admin':
            db.table('admin_details').delete().eq('admin_id', user_id).execute()
        
        db.table('users').delete().eq('id', user_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting account: {e}")
        return False

def update_password(old_password: str, new_password: str, user_id: str):
    """
    Updates the password for a user after verifying the old password.
    
    Args:
        old_password (str): The current password to verify.
        new_password (str): The new password to set.
        user_id (int): The user's ID.
    """
    try:
        result = db.table('users').select('password').eq('id', user_id).limit(1).execute()
        if not result.data:
            return {"status": "error", "message": "User not found"}
        
        current_password = result.data[0]['password']
        
        if not bcrypt.checkpw(old_password.encode('utf-8'), current_password.encode('utf-8')):
            return {"status": "error", "message": "Old password is incorrect"}
        
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        update_result = db.table('users').update({'password': hashed_new_password}).eq('id', user_id).execute()
        
        if update_result.data:
            return {"status": "success", "message": "Password updated successfully"}
        else:
            return {"status": "error", "message": "Failed to update password"}
            
    except Exception as e:
        print(f"Error updating password: {e}")
        return {"status": "error", "message": f"Error: {str(e)}"}



def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(user_id: str, email: str):
    """
    Send OTP to user's email.

    Args:
        user_id (str): The user's ID.
        email (str): The user's email address.
    """
    try:
        otp_code = generate_otp()
        expires_at = datetime.now() + timedelta(minutes=5)
        db.table('otp_storage').insert({
            'user_id': user_id,
            'email': email,
            'otp': otp_code,
            'expiry_time': expires_at.replace(tzinfo=None).isoformat()
        }).execute()
        print(f"Stored OTP for {email}: {otp_code}, expires at {expires_at}")

        message = Mail(
            from_email=SENDGRID_SENDER_EMAIL,
            to_emails=email,
            subject='Your One-Time Password (OTP) for AgroSaarthi',
            html_content=f'<strong>Your OTP is: {otp_code}</strong><br>This code is valid for 5 minutes. Do not share it with anyone.'
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"OTP email sent to {email} with status code: {response.status_code}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def forgot_password(email: str):
    """
    Initiates the forgot password process by sending OTP to user's email.
    
    Args:
        email (str): The user's email address.
    """
    try:
        user_result = db.table('users').select('id, name').eq('email', email).limit(1).execute()
        if not user_result.data:
            return {"status": "error", "message": "Email not found"}
        
        user_id = user_result.data[0]['id']
        
        if send_otp_email(user_id, email):
            return {"status": "success", "message": f"OTP sent to {email}"}
        else:
            return {"status": "error", "message": "Failed to send OTP"}
            
    except Exception as e:
        print(f"Error in forgot password: {e}")
        return {"status": "error", "message": f"Error: {str(e)}"}

def verify_otp_and_reset_password(email: str, otp: str, new_password: str):
    """
    Verifies OTP and resets password if valid.
    
    Args:
        email (str): The user's email address.
        otp (str): The OTP entered by user.
        new_password (str): The new password to set.
    """
    try:
        user_result = db.table('users').select('id').eq('email', email).limit(1).execute()
        if not user_result.data:
            return {"status": "error", "message": "Email not found"}
        
        user_id = user_result.data[0]['id']
        
        otp_result = db.table('otp_storage').select('*').eq('user_id', user_id).eq('otp', otp).eq('used','false').limit(1).execute()
        
        if not otp_result.data:
            print(f"Invalid OTP for user {user_id}")
            return {"status": "error", "message": "Invalid OTP"}
        
        stored_otp = otp_result.data[0]
        expiry_time = datetime.fromisoformat(stored_otp['expiry_time'])
        
        # Make both datetime objects timezone-naive for comparison
        current_time = datetime.now()
        if expiry_time.tzinfo is not None:
            expiry_time = expiry_time.replace(tzinfo=None)
        
        if current_time > expiry_time:
            return {"status": "error", "message": "OTP has expired"}
        
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        update_result = db.table('users').update({'password': hashed_password}).eq('id', user_id).execute()
        
        if not update_result.data:
            return {"status": "error", "message": "Failed to update password"}
        
        db.table('otp_storage').update({'used': 'true'}).eq('user_id', user_id).eq('otp', otp).execute()
        
        return {"status": "success", "message": "Password reset successfully"}
        
    except Exception as e:
        print(f"Error in verify OTP and reset password: {e}")
        return {"status": "error", "message": f"Error: {str(e)}"}

def upload_image(image_file, pest_name, user_id=None):
    """
    Uploads an image to Supabase Storage and returns the public URL.
    
    Args:
        image_file: The uploaded file object
        pest_name (str): Name of the pest for filename
        user_id (str, optional): User ID for logging
    
    Returns:
        dict: Contains success status, filename, and public_url
    """
    try:
        if not image_file.filename:
            return {"status": "error", "message": "Invalid filename"}
        
        file_extension = image_file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{pest_name}_{uuid.uuid4()}.{file_extension}"
        
        # Define the path in your Supabase bucket
        storage_path = f"pest-images/{unique_filename}"
        
        # Upload the file to Supabase Storage
        db.storage.from_("pest-images").upload(storage_path, image_file.read(), {
            "content-type": image_file.content_type
        })

        # Get the public URL for the uploaded image
        public_url = db.storage.from_("pest-images").get_public_url(storage_path)

        if user_id:
            print(f"User {user_id} uploaded image. Public URL: {public_url}")
        else:
            print(f"Image uploaded to {public_url}")

        return {
            "status": "success",
            "message": "Image uploaded successfully",
            "filename": unique_filename,
            "public_url": public_url
        }

    except Exception as e:
        print(f"Error uploading image: {e}")
        return {"status": "error", "message": f"Failed to upload image: {str(e)}"}
