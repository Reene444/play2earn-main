from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from flask_cors import CORS, cross_origin
import os
import logging
from werkzeug.utils import secure_filename
from utils import process_cv_file, calculate_context_score, allowed_file, calculate_skill_score, calculate_experience_score
from models import CVAnalysis, User
from jwt import decode, ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv
from CV_Analyze_Multi_process_Final import analyze_cvs
from bson import ObjectId
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

cv_bp = Blueprint('cv', __name__)

def verify_jwt(token):
    try:
        decoded = decode(token, os.getenv('JWT_SECRET_KEY'), 'HS256')
        return decoded
    except ExpiredSignatureError:
        return {"msg": "Token has expired"}
    except InvalidTokenError:
        return {"msg": "Invalid token"}

@cross_origin(origins='http://localhost:5173') 
@cv_bp.route('/upload', methods=['POST'])
def upload_cv():
    #JWT verification
    token = request.cookies.get('token') 
    
    if not token:
        return jsonify({"msg": "Missing token"}), 401

    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401

    logging.debug('Entering upload_cv function')
    user_identity = decoded
    user_identity_id = user_identity["_id"]
    user = User.objects(id=ObjectId(user_identity_id)).only('username').first()


    if 'file' not in request.files:
        logging.debug('No file part in request')
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    job_title = request.form.get('job_title')

    if file.filename == '':
        logging.debug('No selected file')
        return jsonify({"error": "No selected file"}), 400

    if not job_title:
        logging.debug('No job title provided')
        return jsonify({"error": "No job title provided"}), 400

    if file and allowed_file(file.filename, {'pdf', 'docx', 'doc'}):
        filename = secure_filename(file.filename)
        # Construct the user-specific upload path
        user_upload_folder = current_app.config['UPLOAD_FOLDER']

        # Ensure the directory exists
        os.makedirs(user_upload_folder, exist_ok=True)

        # Save the file
        file_path = os.path.join(user_upload_folder, filename)
        file.save(file_path)
        logging.debug(f'File saved at: {file_path}')

        file_name, text, name, designation, experience, education, skills = process_cv_file(file_path, filename)

        if name is None:
            logging.debug('Failed to extract information from CV')
            return jsonify({"error": "Failed to extract information from CV"}), 400


        if user:
            cv_analysis = CVAnalysis(
                file_name=file_name,
                user=user,
                name=name or "",
                designation=designation or "",
                experience=experience or "",
                education=education or "",
                skills=skills or "",
                salary_expectation="",
                description="",
                professional_title=job_title,
                years_of_experience=""
            )
            cv_analysis.save()
            logging.debug('CV analysis saved to database')

        response = {
            "file_name": file_name,
            "context_score": None,
            "name": name or "",
            "designation": designation or "",
            "experience": experience or "",
            "education": education or "",
            "skills": skills or "",
            "salary_expectation": "",
            "description": "",
            "professional_title": job_title,
            "years_of_experience": ""
        }
        logging.debug('Returning JSON response')
        return jsonify(response), 200

    else:
        logging.debug('Invalid file type')
        return jsonify({"error": "Invalid file type"}), 400

@cv_bp.route('/add', methods=['POST'])
def manual_upload_cv():
    #JWT verification
    token = request.cookies.get('token') 
    
    if not token:
        return jsonify({"msg": "Missing token"}), 401

    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401

    user_identity = decoded
    user_identity_id = user_identity["_id"]
    user = User.objects(id=ObjectId(user_identity_id)).only('username').first()
    logging.debug('Entering manual_upload_cv function')
    data = request.json
    full_name = data.get('name')
    skills = data.get('skills')
    years_of_experience = data.get('yoe')
    salary_expectation = data.get('salaryExpectations')
    description = data.get('jd')
    education = data.get('ee')
    experience = data.get('we')
    professional_title = None  #Disabled because it is not requested in frontend

    if not all([full_name, skills, years_of_experience, salary_expectation, description]):
        logging.debug('Missing required fields in request')
        return jsonify({"error": "Missing required fields"}), 400

    if user:
        cv_analysis = CVAnalysis(
            user=user,
            name=full_name or "",
            experience=experience or "",
            education=education or "",
            skills=skills or "",
            salary_expectation=salary_expectation or "",
            description=description,
            years_of_experience=years_of_experience
        )
        cv_analysis.save()
        logging.debug('CV analysis saved to database')

    response = {
        "full_name": full_name,
        "skills": skills,
        "years_of_experience": years_of_experience,
        "salary_expectation": salary_expectation,
        "description": description,
        "professional_title": professional_title
    }
    logging.debug('Returning JSON response for manual upload')
    return jsonify(response), 200

@cv_bp.route('/analyze', methods=['POST'])
def analyze_resumes():
    #JWT verification
    token = request.cookies.get('token') 
    
    if not token:
        print(token)
        return jsonify({"msg": "Missing token"}), 401

    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401

    logging.debug('Entering analyze_resumes function')
    data = request.get_json()  # Get the JSON data from the request body
    sample_jd = data.get('sample_jd')  # Extract the sample_jd from the JSON data

    if not sample_jd:
        logging.debug('No job description provided')
        return jsonify({"error": "No job description provided"}), 400

    # Get all CVs in the uploads folder
    
    upload_folder = current_app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        logging.debug('No CVs found')
        return jsonify({"error": "No CVs found"}), 404
    
    # Calculate skill score
    try:
        result = analyze_cvs(sample_jd, upload_folder, "linkedin skill")
        logging.debug(result)
    except Exception as e:
        logging.error(f"Error analyzing resumes: {e}")
        return jsonify({"error": "Error analyzing resumes"}), 500
    
    return jsonify(result), 200
