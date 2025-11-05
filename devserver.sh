#!/bin/sh
source .venv/bin/activate

# Set a default port if the PORT environment variable is not set
if [ -z "$PORT" ]; then
  PORT=8080
fi

# Run the Flask development server
python -u -m flask --app main run --port "$PORT" --debug
