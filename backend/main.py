from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS

from config import app,db
from models import Pest


cors=CORS(app,origins='*')

@app.route("/api/users",methods=['GET'])
def users():
    return jsonify(
        {
            "users":[
                'sushmetha',
                'abhinav',
                'harshavardhan',
                'kiran',
                'arjun'
            ]
        }
    )

@app.route("/pests",methods=['GET'])
def get_pests():
    try:
        pests=Pest.query.all()
        return jsonify([pest.to_json() for pest in pests]),200
    except SQLAlchemyError as e:
        return jsonify({"error":f"Could not retrieve pests: {str(e)}"}),500
    
@app.route("/pests/<int:pest_id>",methods=['GET'])
def get_pest(pest_id):
    try:
        pest=Pest.query.get(pest_id)
        if pest:
            return jsonify(pest.to_json()),200
        else:
            return jsonify({"error":"Pest not found"}),404
    except SQLAlchemyError as e:
        return jsonify({"error":f"Database error: {str(e)}"}),500
    

@app.route("/create_contact",methods=['POST'])
def create_pest():
    try:
        name=request.json.get("name")
        description=request.json.get("description")
        crop_affected=request.json.get("cropAffected")

        if not name or not description or not crop_affected:
            return jsonify({"message":"You must include a name, description and the crops affected"}),400
        
        new_pest=Pest(name=name,description=description,crop_affected=crop_affected)
        db.session.add(new_pest)
        db.session.commit()

        return jsonify({"message":"New pest added"}),201

    except SQLAlchemyError as e:
        return jsonify({"error":f"Database error: {str(e)}"}),500
    
@app.route("/update_pest/<int:pest_id>",methods=['PATCH'])
def update_pest(pest_id):
    pest=Pest.query.get(pest_id)
    if not pest:
        return jsonify({"error":"Pest not found"}),404
    
    data=request.json
    pest.name=data.get("name",pest.name)
    pest.description=data.get("description",pest.description)
    pest.crops_affected=data.get("cropsAffected",pest.crops_affected)
    db.session.commit()

    return jsonify({"message":"Pest updated"}),200

@app.route("/delete_pest/<int:pest_id>",methods=['DELETE'])
def delete_contact(pest_id):
    pest=Pest.query.get(pest_id)
    if not pest:
        return jsonify({"error":"Pest not found"}),404
    
    db.session.delete(pest)
    db.session.commit()

    return jsonify({"message":"Pest deleted"}),200


if __name__=="__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True,host='0.0.0.0',port=5001)