#!/bin/bash

# Define variables 
echo "<< ========== Define variables ============ >>"
PROCESS_NAME="server_api"
PORT=4000

# Step 1: Stop PM2 running process
echo "<< ==========  Stoping PM2 running process $PROCESS_NAME ============ >>"
pm2 stop $PROCESS_NAME

# Step 2: Pull latest changes from Git repository 
echo "<< ==========  Pulling latest changes from Git repository... ============ >>"
git pull

# Step 3: Clean install npm dependencies 
echo "<< ========== Installing npm dependencies... ============ >>"
npm ci

# Step 4: Build the project
echo "<< ========== Building the project... ============ >>"
npm run build

# Step 5: Starting migration
echo "<< ========== Starting migration... ============ >>"
npm run typeorm:run-migrations


# Step 6: Reload or start the PM2 process 
echo "<< ========== Reloading or starting the PM2 process... ============ >>"
if pm2 reload "$PROCESS_NAME"; then
    echo "$PROCESS_NAME reloaded"
    pm2 status
else
    echo "Creating a new instance for $PROCESS_NAME"
    pm2 start "npm run start" --name "$PROCESS_NAME" -- --port "$PORT"
    pm2 save
fi

