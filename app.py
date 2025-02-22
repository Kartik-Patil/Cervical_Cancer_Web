from flask import Flask, render_template, request
import tensorflow as tf
import numpy as np
from PIL import Image
import os
import logging

# Initialize Flask app
app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO)

# Model path
MODEL_PATH = "model/end.h5"
UPLOAD_FOLDER = "static/uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Define class labels
CLASS_LABELS = [
    "Carcinoma In Situ",
    "Light Dysplastic",
    "Moderate Dysplastic",
    "Normal Columnar",
    "Normal Intermediate",
    "Normal Superficial",
    "Severe Dysplastic"
]

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the model efficiently
def load_model():
    try:
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        logging.info("✅ Model loaded successfully!")
        return model
    except Exception as e:
        logging.error(f"❌ Error loading model: {e}")
        return None

model = load_model()

def preprocess_image(image_path):
    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224), Image.LANCZOS)
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        return img_array
    except Exception as e:
        logging.error(f"❌ Error preprocessing image: {e}")
        return None

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        if "file" not in request.files:
            return "No file uploaded", 400
        
        file = request.files["file"]
        if file.filename == "" or not allowed_file(file.filename):
            return "Invalid file type. Upload PNG, JPG, or JPEG.", 400
        
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        img_array = preprocess_image(filepath)
        if img_array is None:
            return "Error processing image", 400

        if model is not None:
            predictions = model.predict(img_array)[0]  # Get class probabilities
            class_index = np.argmax(predictions)  # Get class index
            predicted_class = CLASS_LABELS[class_index]  # Get class label
            confidence = f"Confidence: {predictions[class_index] * 100:.2f}%"
        else:
            return "Model not loaded properly", 500

        return render_template("index.html", result=predicted_class, confidence=confidence, image_url=filepath)
    
    return render_template("index.html", result=None, confidence=None, image_url=None)

@app.route("/symptoms")
def symptoms():
    return render_template("symptoms.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/faqs")
def faqs():
    return render_template("faqs.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

