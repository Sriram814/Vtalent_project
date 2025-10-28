# from flask import Flask, request, jsonify, session
# from flask_cors import CORS
# import random
# import smtplib

# app = Flask(__name__)
# app.secret_key = "supersecretkey"
# CORS(app)  # allow React frontend

# # ==============================
# # Email OTP function
# # ==============================
# def send_otp_email(receiver_email, otp):
#     sender_email = "boppanarakeshchowdary@gmail.com"
#     sender_password = "cret kfba voge dwww"  # move to .env in production
#     subject = "Your Vtalent OTP"
#     body = f"Your OTP is: {otp}"
#     message = f"Subject: {subject}\n\n{body}"
#     try:
#         with smtplib.SMTP("smtp.gmail.com", 587) as server:
#             server.starttls()
#             server.login(sender_email, sender_password)
#             server.sendmail(sender_email, receiver_email, message)
#         return True
#     except Exception as e:
#         print("Error sending email:", e)
#         return False

# # ==============================
# # Send OTP route
# # ==============================
# @app.route("/send-otp", methods=["POST"])
# def send_otp():
#     data = request.get_json()
#     email = data.get("email")
#     if not email:
#         return jsonify({"success": False, "message": "Email is required"}), 400

#     otp = str(random.randint(100000, 999999))
#     session['forgot_otp'] = otp
#     session['forgot_email'] = email

#     if send_otp_email(email, otp):
#         return jsonify({"success": True, "message": "OTP sent"})
#     else:
#         return jsonify({"success": False, "message": "Failed to send OTP"}), 500

# # ==============================
# # Verify OTP route
# # ==============================
# @app.route("/verify-otp", methods=["POST"])
# def verify_otp():
#     data = request.get_json()
#     entered_otp = data.get("otp")
#     if entered_otp == session.get("forgot_otp"):
#         return jsonify({"success": True})
#     else:
#         return jsonify({"success": False, "message": "Invalid OTP"}), 400

# # ==============================
# # Reset password route
# # ==============================
# # Using localStorage on frontend; backend just confirms OTP
# @app.route("/reset-password", methods=["POST"])
# def reset_password():
#     data = request.get_json()
#     new_password = data.get("new_password")
#     email = session.get("forgot_email")

#     if not new_password or not email:
#         return jsonify({"success": False, "message": "Missing data"}), 400

#     # The React app updates localStorage for new password
#     session.pop("forgot_email", None)
#     session.pop("forgot_otp", None)
#     return jsonify({"success": True, "message": "Password reset successful"})

# if __name__ == "__main__":
#     app.run(debug=True)
