from flask import jsonify, request
from flask_cors import CORS

from config import app
from utils import (
    register_user, login_user, update_user_profile, update_supplier_details, update_farmer_details, update_admin_details,
    submit_feedback, log_sms_interaction, log_pest_detection, update_weather_data, get_weather_data, get_schemes_by_location,
    get_user_name, get_last_4_pest_images,  get_pest_history, get_last_contacted_suppliers,
    get_supplier_inventory, update_inventory, get_user_info, delete_account, get_supplier_details, call_supplier
)

cors=CORS(app,origins='*')

#---------------------------------Route functions--------------------------------------------------------------------------


@app.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    user_type = data.get('role')
    location = data.get('district')
    res = register_user(name, email, phone, password, user_type, location)
   
    if res["status"] == "success":
        return jsonify({"message": res["message"]}), 201
    else:
        return jsonify({"error": res["message"]}), 400

@app.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    response = login_user(email, password)
    status_code = 200 if response["status"] == "success" else 401
    return jsonify(response), status_code

@app.route('/update_profile/<user_id>', methods=['PUT'])
@app.route('/update_profile/<user_id>', methods=['PUT'])
def update_profile_route(user_id):
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    district = data.get('district')
    phone = data.get('phone')
    district = data.get('district')

    if update_user_profile(user_id, name, phone, district):
    if update_user_profile(user_id, name, phone, district):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

    
@app.route('/supplier_details/<supplier_id>', methods=['PUT'])
@app.route('/supplier_details/<supplier_id>', methods=['PUT'])
def update_supplier_details_route(supplier_id):
    data = request.get_json()
    shop_name = data.get('shop_name')
    address = data.get('address')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    approved = data.get('approved')
    service_areas = data.get('service_areas')
    approved = data.get('approved')
    service_areas = data.get('service_areas')

    if update_supplier_details(supplier_id, shop_name, address, latitude, longitude, approved, service_areas):
    if update_supplier_details(supplier_id, shop_name, address, latitude, longitude, approved, service_areas):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

@app.route('/farmer_details/<farmer_id>', methods=['PUT'])
def update_farmer_details_route(farmer_id):
    data = request.get_json()
    farm_size = data.get('farmSize')
    main_crop = data.get('main_crop')
    irrigation_type = data.get('irrigation_type')

    if update_farmer_details(farmer_id, farm_size, main_crop, irrigation_type):
    if update_farmer_details(farmer_id, farm_size, main_crop, irrigation_type):
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
    response = data.get('response')

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

@app.route('/pest_history/<user_id>', methods=['GET'])
def pest_history_route(user_id):
    history = get_pest_history(user_id)
    return jsonify({'history': history}), 200

@app.route('/last_contacted_suppliers/<farmer_id>', methods=['GET'])
def last_contacted_route(farmer_id):
    contacts = get_last_contacted_suppliers(farmer_id)
    if contacts:
        return jsonify({'contacts': contacts}), 200
    else:
        return jsonify({'error': 'No contact information found'}), 404

@app.route('/supplier_inventory/<supplier_id>', methods=['GET'])
def supplier_inventory_route(supplier_id):
    inventory = get_supplier_inventory(supplier_id)
    if inventory:
        return jsonify({'inventory': inventory}), 200
    else:
        return jsonify({'error': 'Inventory not found'}), 404

@app.route('/update_inventory/<supplier_id>', methods=['PUT'])
def update_inventory_route(supplier_id):
    data = request.get_json()
    price = data.get('price')
    stock = data.get('stock')
    pesticide = data.get('pesticide')

    if update_inventory(price, stock, pesticide, supplier_id):
        return jsonify({"message": "Inventory updated successfully"}), 200
    else:
        return jsonify({"error": "Inventory update failed"}), 400

@app.route('/supplier_details', methods=['POST'])
def supplier_details_route():
    data = request.get_json()
    pesticide_name = data.get('pesticide_name')
    suppliers = get_supplier_details(pesticide_name)
    return jsonify({'suppliers': suppliers}), 200

@app.route('/call_supplier', methods=['POST'])
def call_supplier_route():
    data = request.get_json()
    supplier_id = data.get('supplier_id')
    farmer_id = data.get('farmer_id')
    pesticide = data.get('pesticide')
    phone = call_supplier(supplier_id,farmer_id,pesticide)
    if phone:
        return jsonify({'supplier_phone': phone}), 200
    else:
        return jsonify({'error': 'Supplier not found'}), 404

@app.route('/user_info/<user_id>', methods=['GET'])
def user_info_route(user_id):
    try:
        # Check if user_id is valid
        if user_id == "undefined" or user_id == "null" or not user_id:
            return jsonify({'error': 'Invalid user ID'}), 400
        
        user_info = get_user_info(user_id)
        if user_info:
            return jsonify(user_info), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    try:
        # Check if user_id is valid
        if user_id == "undefined" or user_id == "null" or not user_id:
            return jsonify({'error': 'Invalid user ID'}), 400
        
        user_info = get_user_info(user_id)
        if user_info:
            return jsonify(user_info), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/delete_account/<user_id>', methods=['DELETE'])
def delete_account_route(user_id):
    if delete_account(user_id):
    if delete_account(user_id):
        return jsonify({'message': 'Account deleted'}), 200
    else:
        return jsonify({'error': 'Account deletion failed'}), 400

#-------------------------------------------------------------------------------------------------

if __name__=="__main__":
    app.run(debug=True,host='0.0.0.0',port=5001)
