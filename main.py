
import os
from flask import Flask, send_from_directory, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///games.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'a-very-secret-key'

db = SQLAlchemy(app)

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playername = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    score = db.Column(db.Integer, default=0)
    credits = db.Column(db.Integer, default=100)

    def __repr__(self):
        return f'<Player {self.playername}>'

# Automatically create the database tables if they don't exist
with app.app_context():
    db.create_all()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('playername') or not data.get('password'):
        return jsonify({'message': 'Missing playername or password'}), 400

    if Player.query.filter_by(playername=data['playername']).first():
        return jsonify({'message': 'Playername already exists!'}), 409

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_player = Player(playername=data['playername'], password=hashed_password)
    db.session.add(new_player)
    db.session.commit()
    return jsonify({'message': 'New player created!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    player = Player.query.filter_by(playername=data['playername']).first()
    if not player or not check_password_hash(player.password, data['password']):
        return jsonify({'message': 'Login failed!'}), 401
    return jsonify({'message': 'Login successful!'})

@app.route('/player/<playername>', methods=['GET'])
def get_player(playername):
    player = Player.query.filter_by(playername=playername).first()
    if not player:
        return jsonify({'message': 'Player not found!'}), 404
    player_data = {
        'playername': player.playername,
        'score': player.score,
        'credits': player.credits
    }
    return jsonify(player_data)

@app.route('/player/<playername>/score', methods=['PUT'])
def update_score(playername):
    player = Player.query.filter_by(playername=playername).first()
    if not player:
        return jsonify({'message': 'Player not found!'}), 404
    data = request.get_json()
    player.score = data.get('score', player.score)
    player.credits = data.get('credits', player.credits)
    db.session.commit()
    return jsonify({'message': 'Player data updated!'})

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data['message'].lower()
    reply = ""

    if 'jump' in message:
        reply = "You can jump by pressing the Enter or Spacebar."
    elif 'color' in message:
        reply = "You can change your color by pressing the 'C' key."
    elif 'score' in message:
        reply = "You get points by surviving. The longer you last, the higher your score!"
    elif 'name' in message or 'who are you' in message:
        reply = "I am a helpful chatbot for this game!"
    else:
        reply = "I'm not sure how to answer that. You can ask me about jumping, changing color, or the score."

    return jsonify({'reply': reply})


@app.route('/')
def index():
    return send_from_directory('src', 'login.html')

@app.route('/game')
def game():
    return send_from_directory('src', 'index.html')

@app.route('/public/<path:path>')
def serve_public(path):
    return send_from_directory('public', path)

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('src', path)

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 8080)))
