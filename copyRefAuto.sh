#!/bin/bash

# Prompt the user for the destination directory
read -p "Enter the destination directory: " DEST_DIR

# Check if the destination directory is valid
if [ ! -d "$DEST_DIR" ]; then
  echo "Error: Destination directory does not exist."
  exit 1
fi

# Copy files excluding 'node_modules'
rsync -av --progress --exclude 'node_modules' ./js-project-init-ref/ "$DEST_DIR"

echo "Files have been copied to $DEST_DIR excluding 'node_modules'."
