# from flask import Flask
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy.exc import SQLAlchemyError
# from dotenv import load_dotenv
# import os

# load_dotenv()

# app=Flask(__name__)
# CORS(app)

# app.config["SQLALCHEMY_DATABASE_URI"]=os.getenv('DATABASE_URL')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

# db=SQLAlchemy(app)
#-------------------------------------------------------------------------------------------------
# from sqlalchemy import create_engine
# # from sqlalchemy.pool import NullPool
# from dotenv import load_dotenv
# import os

# # Load environment variables from .env
# load_dotenv()

# # Fetch variables
# USER = os.getenv("user")
# PASSWORD = os.getenv("password")
# HOST = os.getenv("host")
# PORT = os.getenv("port")
# DBNAME = os.getenv("dbname")

# # Construct the SQLAlchemy connection string
# DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# # Create the SQLAlchemy engine
# engine = create_engine(DATABASE_URL)
# # If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
# # https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
# # engine = create_engine(DATABASE_URL, poolclass=NullPool)

# # Test the connection
# try:
#     with engine.connect() as connection:
#         print("Connection successful!")
# except Exception as e:
#     print(f"Failed to connect: {e}")

#------------------------------------------------------------------------------------------
from flask import Flask, jsonify
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

db = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
