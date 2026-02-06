#!/bin/bash

echo "========================================"
echo "  TIỂU THUYẾT GIA ĐẠI TÀI AI - SETUP"
echo "========================================"
echo

echo "[1/3] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo
echo "[2/3] Checking .env.local file..."
if [ ! -f ".env.local" ]; then
    echo "Creating new .env.local file..."
    echo "# Gemini API Key" > .env.local
    echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" >> .env.local
    echo
    echo "!!! IMPORTANT: Open .env.local and replace YOUR_API_KEY_HERE with your actual API key !!!"
    echo "Get API key from: https://makersuite.google.com/app/apikey"
    echo
else
    echo ".env.local file already exists."
fi

echo
echo "[3/3] Setup completed!"
echo
echo "Run the application:"
echo "  npm run dev"
echo
echo "Open browser at: http://localhost:5173"
echo
