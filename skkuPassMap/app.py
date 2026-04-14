from flask import Flask, render_template
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route("/")
def home():
    kakao_js_key = os.getenv("KAKAO_JS_KEY", "")
    return render_template("index.html", kakao_js_key=kakao_js_key)

if __name__ == "__main__":
    app.run(debug=True)