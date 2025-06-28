from flask import jsonify, request
from decimal import Decimal
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from flask_cors import CORS

from config import app,db
from models import User,FarmerDetails,SupplierDetails,AdminDetails,WeatherSchemeCache


cors=CORS(app,origins='*')

#--------------------------------------------------------------------

def register_user(name: str, email: str, phone: str, password: str, user_type: str, location: str) -> bool:
    """
    Registers a new user in the system.

    Args:
        name (str): The user's name.
        email (str): The user's email (must be unique).
        phone (str): The user's phone number (must be unique).
        password (str): The password for the account (Don't forget).
        user_type (str): The type of user (e.g., 'farmer', 'supplier', 'admin').
        location (str): The user's initial location string.

    Returns:
        bool: True if registration is successful, False otherwise.
    """
    if  not email or not password or not user_type:
        print("Error: Email, password, and user type are required for registration.")
        return False

    existing_user_email = User.query.filter_by(email=email).first()
    existing_user_phone = User.query.filter_by(phone=phone).first()

    if existing_user_email:
        print(f"Error: User with email '{email}' already exists.")
        return False
    if existing_user_phone:
        print(f"Error: User with phone '{phone}' already exists.")
        return False

    try:
        new_user = User(
            name=name,
            email=email,
            phone=phone,
            user_type=user_type,
            location=location,
            
        )
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()
        print(f"User '{email}' registered successfully as {user_type}.")
        return True
    except IntegrityError as e:
        db.session.rollback() # Rollback in case of unique constraint violation or similar
        print(f"Database integrity error during registration: {e}")
        return False
    except Exception as e:
        db.session.rollback()
        print(f"An unexpected error occurred during registration: {e}")
        return False

def login_user(email: str, password: str) -> bool:
    """
    Authenticates a user based on email and password.

    Args:
        phone (str): The user's email.
        password (str): The plaintext password provided by the user.

    Returns:
        bool: True if login is successful, False otherwise.
    """
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        print(f"User '{email}' logged in successfully.")
        # Generate session token??
        return True
    else:
        print(f"Login failed: Invalid email or password.")
        return False

def update_user_profile(user_id: int, name: str, phone: str, location: str) -> None:
    """
    Updates the profile information for a given user.

    Args:
        user_id (int): The ID of the user to update.
        name (str): The new name for the user.
        phone (str): The new phone number for the user.
        location (str): The new location string for the user.
    """
    user = User.query.get(user_id)

    if not user:
        print(f"Error: User with ID {user_id} not found.")
        return False

    try:
        if name is not None:
            user.name = name
        if phone is not None:
            existing_user_with_phone = User.query.filter(User.phone == phone, User.id != user_id).first()
            if existing_user_with_phone:
                print(f"Error: Phone number '{phone}' already in use by another user.")
                return False
            user.phone = phone
        if location is not None:
            user.location = location

        db.session.commit()
        print(f"User ID {user_id} profile updated successfully.")
        return True
    except IntegrityError as e:
        db.session.rollback()
        print(f"Database integrity error during profile update: {e}")
        return False
    except Exception as e:
        db.session.rollback()
        print(f"An unexpected error occurred during profile update: {e}")
        return False

def update_supplier_details(supplier_id: int, shop_name: str, address: str, latitude: Decimal, longitude: Decimal):
    """
    Updates the supplier information.

    Args:
        supplier_id (int): The ID of the supplier to update.
        shop_name (str): The name of the supplier's shop.
        address (str): The address of the shop.
        latitude (Decimal): The latitude of the location of the shop.
        longitude (Decimal): The longitude of the location of the shop.
    """
    supplier = User.query.get(supplier_id)

    if not supplier:
        print(f"Error: User with ID {supplier_id} not found.")
        return False

    try:
        if shop_name is not None:
            supplier.shop_name = shop_name
        if address is not None:
            supplier.address = address
        if latitude is not None and longitude is not None:
            supplier.latitude = latitude
            supplier.longitude = longitude
        db.session.commit()
        print(f"User ID {supplier_id} profile updated successfully.")
        return True
    except IntegrityError as e:
        db.session.rollback()
        print(f"Database integrity error during profile update: {e}")
        return False
    except Exception as e:
        db.session.rollback()
        print(f"An unexpected error occurred during profile update: {e}")
        return False

def update_farmer_details(farmer_id: int, farm_size: Decimal):
    """
    Updates the farmer information.

    Args:
        farmer_id (int): The ID of the farmer to update.
        farm_size (Decimal): The land area of the farm.
    """
    farmer = User.query.get(farmer_id)

    if not farmer:
        print(f"Error: User with ID {farmer_id} not found.")
        return False

    try:
        if farm_size is not None:
            farmer.farm_size = farm_size
        db.session.commit()
        print(f"User ID {farmer_id} profile updated successfully.")
        return True
    except IntegrityError as e:
        db.session.rollback()
        print(f"Database integrity error during profile update: {e}")
        return False
    except Exception as e:
        db.session.rollback()
        print(f"An unexpected error occurred during profile update: {e}")
        return False


#-----------------------------------------------------------------------------------------------------------


@app.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    user_type = data.get('userType')
    location = data.get('location')

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
def update_farmer_details(farmer_id):
    data = request.get_json()
    farm_size=data.get('farmSize')

    if update_supplier_details(farmer_id, farm_size):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

#-------------------------------------------------------------------------------------------------

if __name__=="__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True,host='0.0.0.0',port=5001)