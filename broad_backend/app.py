from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pywhatkit as kit
from io import StringIO
from time import sleep

app = Flask(__name__)
CORS(app)

@app.route('/send-messages', methods=['POST'])
def send_messages():
    data = request.get_json()
    contact_number = data.get('contactNumber')  # It's unclear if this is used, but kept for consistency
    name = data.get('name')  # It's unclear if this is used, but kept for consistency
    csv_data = data.get('csvData')
    message = data.get('message')

    if not csv_data or not message:
        return jsonify({"status": "error", "message": "CSV data or message missing"}), 400

    try:
        # Convert CSV data to pandas DataFrame
        contacts_df = pd.read_csv(StringIO(csv_data))
        contacts = contacts_df['phone_number'].dropna().tolist()
        contacts = [str(contact).strip() for contact in contacts]  # Clean up any extra spaces

        if not contacts:
            return jsonify({"status": "error", "message": "No valid phone numbers found in CSV data"}), 400

        # Function to send message to a single contact
        def send_message(phone_number, message):
            try:
                print(f"Sending message to {phone_number}")
                kit.sendwhatmsg_instantly(phone_number, message)
                print(f"Message sent to {phone_number}")
                sleep(15)  # Wait 20 seconds between messages to avoid overwhelming the browser
            except Exception as e:
                print(f"Failed to send message to {phone_number}: {e}")

        # Send message to all contacts
        for contact in contacts:
            if contact:
                send_message(contact, message)

        return jsonify({"status": "success", "message": "Messages sent successfully"})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"status": "error", "message": "An error occurred while processing your request"}), 500

if __name__ == '__main__':
    app.run(debug=True)
