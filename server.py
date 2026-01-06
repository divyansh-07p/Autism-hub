from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import subprocess
impot os
impot sys
impot threading
import time
import io
import base64

app = Flask(__name__)
CORS(app)

# Store running game processes
running_games = {}

@app.route('/api/launch-game/<game_name>', methods=['GET'])
def launch_game(game_name):
    """Launch a Pygame game in a new window"""
    
    try:
        # Paths to games
        games_path = os.path.join(os.path.dirname(__file__), 'Games')
        
        if game_name == 'bubble-pop':
            game_script = os.path.join(games_path, 'bubble pop', 'bubble_pop_2_deluxe.py')
        elif game_name == 'zen-sorting':
            game_script = os.path.join(games_path, 'Game1', 'game (1).py')
        else:
            return jsonify({'success': False, 'error': f'Unknown game: {game_name}'}), 404
        
        # Check if file exists
        if not os.path.exists(game_script):
            return jsonify({'success': False, 'error': f'Game file not found: {game_script}'}), 404
        
        # Kill previous instance of this game if running
        if game_name in running_games:
            try:
                running_games[game_name].terminate()
                running_games[game_name].wait(timeout=2)
            except:
                try:
                    running_games[game_name].kill()
                except:
                    pass
        
        # Launch the game in a new window
        process = subprocess.Popen(
            [sys.executable, game_script],
            cwd=os.path.dirname(game_script),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NEW_CONSOLE if sys.platform == 'win32' else 0
        )
        
        # Store the process
        running_games[game_name] = process
        
        return jsonify({
            'success': True,
            'message': f'{game_name} game launched in new window!',
            'pid': process.pid
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/games', methods=['GET'])
def get_games():
    """Get list of available games"""
    return jsonify({
        'games': [
            {
                'id': 'bubble-pop',
                'name': 'Bubble Pop',
                'description': 'Click and pop the bubbles! Avoid the bombs!'
            },
            {
                'id': 'zen-sorting',
                'name': 'Zen Sorting',
                'description': 'Drag stones into matching colored bowls'
            }
        ]
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("🎮 Game Server running on http://localhost:5000")
    print("📱 Make sure your React app is running on http://localhost:5174")
    app.run(debug=True, port=5000, use_reloader=False)
