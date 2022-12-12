import os
import json
from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from random import seed, randint

# methods to access the database
from db import get_user, get_statistics, add_statistics, get_user_info, add_user

# create the flask app
api = Flask(__name__, static_folder="./build", static_url_path="")

# jwt configs
api.config["JWT_SECRET_KEY"] = "Value"
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

# connect the flask jwt to the flask app
jwt = JWTManager(api)

# 404 error handling
@api.errorhandler(404)
def not_found(e):
    return send_from_directory(api.static_folder, 'index.html')

# default route for the webapp
@api.route('/', defaults={'path': ''})
def index(path):
    return send_from_directory(api.static_folder, "index.html")

#Routing function to create an access token with each login
#need to configure algorithm to search array of available logins
@api.route('/token', methods=["POST"])
def createToken():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = get_user(email) # get the user details from the db
    if user is None or user['password'] != password:
        return {"msg: Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}
    return response


#Routing to user profile
#needs to return correct profile according to login
#profile includes user statistics
@api.route('/profile')
@jwt_required()
def myProfile():
    email = get_jwt_identity()

    user_info = get_user_info(email)

    response_body = {
        "name" : email,
        "about" : f"Hello I am {email}!",
        "info": user_info
    }

    return response_body

# method to sign up a user
@api.route('/sign_up', methods=["POST"])
def signUp():
    if request.method == "POST":
        data = json.loads(request.data)

        if not data['email'] or not data['password']:
            return { 'msg': 'Invalid Username and/or password values', 'success': False }

        email = data['email']
        password = data['password']
        
        res = add_user(email, password)

        if res['success']:
            access_token = create_access_token(identity=email)
            res["access_token"] = access_token

        return res

# Logout out route
@api.route('/logout', methods=["POST"])
def logout():
    response = jsonify({"msg": "successfully logged out"})
    unset_jwt_cookies(response)
    return response

api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

# route to add statistics
@api.route('/add_entry', methods=["POST"])
@jwt_required()
def add_entry():
    if request.method == "POST":
        data = json.loads(request.data)

        # validate the user input
        if data['level'] <= 0 or data['algorithm'] == '' or data['time'] <= 0:
            return {'message': 'Invalid statistic!'}

        # insert statistics to the db
        add_statistics(email=get_jwt_identity(), algorithm=data['algorithm'], level=data['level'], time=data['time'])

        return { 'message': 'Successfully added to statistics!' }

# route to get all the statistics
@api.route('/get_stats', methods=["GET"])
@jwt_required()
def get_stats():
    email = get_jwt_identity()

    # get the statistics from the db
    data = get_statistics(email)

    return { 'data': data }

# route to get randome numbers
@api.route('/random', methods=["GET"])
def random_nums():
    config = request.args
    results = []

    # default values
    ## size --> 10
    ## min --> 0
    ## max --> 10

    for _ in range(int(config.get("size", 10))):
        results.append(randint(int(config.get("min", 0)), int(config.get("max", 10))))
    return jsonify(results)
