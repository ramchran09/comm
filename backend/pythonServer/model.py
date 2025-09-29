from flask import Flask, request, jsonify
import whisper
import tempfile
import os

app = Flask(__name__)

# ✅ Load model once at startup (kept in memory)
print("Loading Whisper model... (this happens only once)")
model = whisper.load_model("base")
print("Whisper model loaded!")

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["audio"]

    # ✅ Create a temporary file (deleted after processing)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        file.save(tmp.name)
        temp_path = tmp.name

    try:
        # ✅ Run Whisper transcription safely
        try:
            result = model.transcribe(temp_path)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": f"Transcription failed: {str(e)}"}), 500

    finally:
        # ✅ Ensure temp file is always deleted
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"Deleted temp file: {temp_path}")

if __name__ == "__main__":
    app.run(port=6000, debug=True, threaded=True)
