import os

from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route("/")
def index():
    return send_from_directory("src", "index.html")


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory("src", path)

@app.route("/public/<path:path>")
def serve_public(path):
    return send_from_directory("public", path)


def main():
    app.run(port=int(os.environ.get("PORT", 80)))


if __name__ == "__main__":
    main()
