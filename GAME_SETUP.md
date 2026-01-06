# 🎮 Autism Hub - Game Integration Setup

## Quick Start

You need to run **TWO terminals** simultaneously:

### Terminal 1: Flask Game Server
```bash
cd "d:\KodeLand\PROJECTS\Autism Hub"
python server.py
```
This will start on `http://localhost:5000`

### Terminal 2: React Development Server
```bash
cd "d:\KodeLand\PROJECTS\Autism Hub"
npm run dev
```
This will start on `http://localhost:5173`

## How It Works

1. **Open the website** at `http://localhost:5173`
2. **Click "Kids" mode** on the landing page
3. **Go to Games** in the navigation
4. **Click on a game card** (Bubble Pop or Zen Sorting)
5. **The Pygame will launch** in a separate window! 🚀

## Games Available

- **Bubble Pop** - Click bubbles, avoid bombs, 60 seconds
- **Zen Sorting** - Drag stones into matching bowls (calming game)

## Requirements

Make sure you have these installed:
```bash
pip install flask flask-cors
```

## Troubleshooting

- **"Connection refused"**: Make sure `python server.py` is running in Terminal 1
- **Game doesn't launch**: Check that the game files exist in the `Games/` folder
- **Music/sound issues**: Already fixed - the server handles missing files gracefully

Enjoy! 🎉
