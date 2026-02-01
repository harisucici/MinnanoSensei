#!/bin/bash

# Minnano Sensei Development Startup Script
# This script starts all services for development mode

echo "Starting Minnano Sensei development environment..."

# Function to start backend
start_backend() {
    echo "Starting backend server..."
    cd minnano_sensei_backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    echo "Backend started with PID $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "Starting frontend server..."
    cd minnano_sensei_vue
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "Frontend started with PID $FRONTEND_PID"
}

# Parse command line arguments
case "$1" in
    "backend")
        echo "Starting only backend..."
        start_backend
        ;;
    "frontend")
        echo "Starting only frontend..."
        cd minnano_sensei_vue
        npm run dev &
        echo "Frontend started"
        ;;
    "mock")
        echo "Starting mock API server..."
        cd minnano_sensei_mock
        npm run dev &
        echo "Mock API started"
        ;;
    *)
        echo "Starting all services..."
        start_backend
        sleep 3  # Wait for backend to start
        start_frontend
        
        echo ""
        echo "==========================================="
        echo "Minnano Sensei Development Environment Ready!"
        echo ""
        echo "Frontend: http://localhost:3000"
        echo "Backend:  http://localhost:5000"
        echo "==========================================="
        echo ""
        echo "Press Ctrl+C to stop all services"
        echo ""
        
        # Wait for processes to finish
        wait $BACKEND_PID $FRONTEND_PID
        ;;
esac