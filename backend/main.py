from flask import jsonify, request
from flask_cors import CORS
import uuid

from config import app
from utils import (
    register_user, login_user, update_user_profile, update_supplier_details, update_farmer_details, update_admin_details,
    submit_feedback, log_sms_interaction, log_pest_detection, update_weather_data, get_schemes_by_location,
    get_user_name, get_last_4_pest_images, get_pest_history, get_last_contacted_suppliers,
    get_supplier_inventory, update_inventory, get_user_info, delete_account, get_supplier_details, call_supplier, update_password,
    forgot_password, verify_otp_and_reset_password, upload_image, get_contacts_for_supplier
    )
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os


# CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers="*", supports_credentials=True)
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

@app.route('/profile/<user_id>', methods=['PUT'])
def update_profile_route(user_id):
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')

    result = update_user_profile(user_id, name, location)
    if result == "no_change":
        return jsonify({"message": "No changes made"}), 200
    elif result:
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

    
@app.route('/supplier_details/<supplier_id>', methods=['PUT'])
def update_supplier_details_route(supplier_id):
    data = request.get_json()
    shop_name = data.get('shop_name')
    address = data.get('address')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    result = update_supplier_details(supplier_id, shop_name, address, latitude, longitude)
    if result == "no_change":
        return jsonify({"message": "No changes made"}), 200
    elif result:
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

@app.route('/farmer_details/<farmer_id>', methods=['PUT'])
def update_farmer_details_route(farmer_id):
    data = request.get_json()
    farm_size=data.get('farm_size')
    main_crop=data.get('main_crop')
    irrigation_type=data.get('irrigation_type')
    soil_type=data.get('soil_type')

    result = update_farmer_details(farmer_id, farm_size, main_crop, irrigation_type, soil_type)
    if result == "no_change":
        return jsonify({"message": "No changes made"}), 200
    elif result:
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Profile update failed"}), 400

@app.route('/admin_details/<admin_id>',methods=['PUT'])
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
        
@app.route('/upload-image', methods=['POST'])
def upload_image_endpoint():
    print("FILES:", request.files)
    print("FORM:", request.form)
    
    if 'image' not in request.files:
        print("1")
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        print("2")
        return jsonify({"error": "No selected file"}), 400

    pest_name = request.form.get('pest_name')  # ← form data
    user_id = request.form.get("user_id") 
    print('pest_name:', pest_name)

    if not pest_name:
        print("3")
        return jsonify({"error": "Pest name is required"}), 400

    result = upload_image(image_file, pest_name, user_id)

    if result["status"] == "success":
        return jsonify(result), 200
    else:
        return jsonify({"error": result["message"]}), 500


@app.route('/pest_detection/log', methods=['POST'])
def pest_detection_log_route():
    data = request.get_json()
    user_id = data.get('user_id')
    image_url = data.get('image_url')
    pest_name = data.get('pest_name')
    confidence = data.get('confidence')
    pesticide = data.get('pesticide')
    

    if log_pest_detection(user_id, image_url, pest_name, confidence, pesticide):
        return jsonify({"message": "Pest detection logged"}), 201
    else:
        return jsonify({"error": "Failed to log pest detection"}), 400
    


@app.route('/weather_data/<location>', methods=['GET'])
def get_weather_cache_route(location):
    weather_response = update_weather_data(location)
    if weather_response:
        return jsonify({
            "location": weather_response.get("location"),
            "weather_data": weather_response.get("weather_data"),
            "updated_at": weather_response.get("updated_at")
        }), 200
    else:
        return jsonify({'error': 'Weather data not found'}), 404


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
    name = data.get('name')

    if update_inventory(price, stock, pesticide, name, supplier_id):
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
    phone = call_supplier(supplier_id, farmer_id, pesticide)
    if phone:
        return jsonify({'supplier_phone': phone}), 200
    else:
        return jsonify({'error': 'Supplier not found'}), 404

@app.route('/user_info/<user_id>', methods=['GET'])
def user_info_route(user_id):
    info = get_user_info(user_id)
    if info:
        return jsonify(info), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/delete_account/<user_id>', methods=['DELETE'])
def delete_account_route(user_id):
    if delete_account(user_id):
        return jsonify({'message': 'Account deleted'}), 200
    else:
        return jsonify({'error': 'Account deletion failed'}), 400

@app.route('/update_password', methods=['PUT'])
def update_password_route():
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    user_id = data.get('user_id')
    
    result = update_password(old_password, new_password, user_id)
    status_code = 200 if result["status"] == "success" else 400
    return jsonify(result), status_code

@app.route('/forgot_password', methods=['POST'])
def forgot_password_route():
    data = request.get_json()
    email = data.get('email')
    
    result = forgot_password(email)
    status_code = 200 if result["status"] == "success" else 400
    return jsonify(result), status_code

@app.route('/reset_password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')
    
    result = verify_otp_and_reset_password(email, otp, new_password)
    status_code = 200 if result["status"] == "success" else 400
    return jsonify(result), status_code

# Contact Us endpoint
@app.route('/contact', methods=['POST'])
def contact_route():
    data = request.get_json()
    title = data.get('title')
    message = data.get('message')
    user_name = data.get('user_name')
    user_email = data.get('user_email')
    if not title or not message or not user_name or not user_email:
        return jsonify({'error': 'Missing required fields'}), 400

    # Compose email
    email_body = f"Message from {user_name} ({user_email}):\n\n{message}"
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        mail = Mail(
            from_email=os.getenv('SENDGRID_SENDER_EMAIL'),
            to_emails='abhinavchaitanya6@gmail.com',
            subject=title,
            plain_text_content=email_body
        )
        response = sg.send(mail)
        if response.status_code in [200, 202]:
            return jsonify({'message': 'Message sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send message'}), 500
    except Exception as e:
        return jsonify({'error': f'Error sending email: {str(e)}'}), 500

@app.route('/contacts_for_supplier/<supplier_id>', methods=['GET'])
def contacts_for_supplier_route(supplier_id):
    contacts = get_contacts_for_supplier(supplier_id)
    return jsonify({'contacts': contacts}), 200

#-------------------------------------------------------------------------------------------------

if __name__=="__main__":
    app.run(debug=True,host='0.0.0.0',port=5001)