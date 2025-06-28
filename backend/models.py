from config import db
from sqlalchemy.dialects import postgresql as pg
from datetime import datetime
import enum
from werkzeug.security import generate_password_hash, check_password_hash

class UserTypeEnum(enum.Enum):
    FARMER = 'farmer'
    CUSTOMER = 'customer'
    ADMIN = 'admin'

class User(db.Model):
    __tablename__='users'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100),nullable=False)
    email=db.Column(db.String(100),unique=True)
    phone=db.Column(db.String(10),unique=True)
    password_hash=db.Column(db.String(128),nullable=False)
    user_type = db.Column(
        pg.ENUM(UserTypeEnum, name='user_type_enum', create_type=True),
        nullable=False,
        default=UserTypeEnum.CUSTOMER
    )
    location=db.Column(db.String(255),nullable=False)
    preferred_language=db.Column(db.String(5),default='eng',nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.now(),nullable=False)
    updated_at=db.Column(db.DateTime,default=datetime.now(),onupdate=datetime.now(),nullable=False)
    __mapper_args__={
        'polymorphic_on':user_type,
        'polymorphic_identity':'user'
    }

    def set_password(self,password):
        """Hashes the password and stores it."""
        self.password_hash=generate_password_hash(password)
    def check_password(self,password):
        """Checks if the provided password matches the stored password."""
        return check_password_hash(self.password_hash,password)
    def __repr__(self):
        return f'<User {self.name} ({self.user_type})>'
    def to_json(self):
        return {
            'id':self.id,
            'name':self.name,
            'email':self.email,
            'phone':self.phone,
            'user_type':self.user_type,
            'location':self.location,
            'created_at':self.created_at,
            'updated_at':self.updated_at
        }
    
class SupplierDetails(User):
    __tablename__='supplier_details'
    supplier_id=db.Column(db.Integer,db.ForeignKey('users.id'),primary_key=True)
    shop_name=db.Column(db.Text,nullable=False)
    address=db.Column(db.Text,nullable=False)
    latitude=db.Column(db.DECIMAL)
    longitude=db.Column(db.DECIMAL)
    approved=db.Column(db.Boolean)
    __mapper_args__={
        'polymorphic_identity':'supplier'
    }

    def __repr__(self):
        return f'<SupplierDetails {self.name} - {self.shop_name}>'
    
class FarmerDetails(User):
    __tablename__='farmer_details'
    farmer_id=db.Column(db.Integer,db.ForeignKey('users.id'),primary_key=True)
    farm_size=db.Column(db.DECIMAL)
    __mapper_args__={
        'polymorphic_identity':'farmer'
    }

    def __repr__(self):
        return f'<FarmerDetails {self.name}>'
    
class AdminDetails(User):
    __tablename__='admin_details'
    admin_id=db.Column(db.Integer,db.ForeignKey('users.id',primary_key=True))
    admin_level=db.Column(db.Integer,default=1)
    department=db.Column(db.String(50))
    __mapper_args__={
        'polymorphic_identity':'admin'
    }

    def __repr__(self):
        return f'<AdminDetails {self.name} {self.department} - Level {self.admin_level}>'
    
class WeatherSchemeCache(db.Model):
    __tablename__='weather_scheme_cache'
    id=db.Column(db.Integer,primary_key=True)
    location=db.Column(db.String(255),nullable=False)
    weather_data=db.Column(pg.JSONB,nullable=False)
    schemes=db.Column(db.Text,nullable=False)
    updated_at=db.Column(db.DateTime,default=datetime.now(),onupdate=datetime.now(),nullable=False)
