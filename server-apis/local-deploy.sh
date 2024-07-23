#!/bin/bash

# Step 1: Install npm dependencies 
echo "<< ========== Installing npm dependencies... ============ >>"
npm i

# << Step 2: Build the project
echo "<< ========== Building the project... ============ >>"
npm run build

# Step 3: Starting migration
echo "<< ========== Starting migration... ============ >>"
npm run typeorm:run-migrations

# Step : Starting Dev Server
echo "<< ========== Starting Dev Server... ============ >>"
npm run start:dev

