#!/bin/bash
# Navigate to the application directory
cd /home/ubuntu/optimizedcvui
# Pull the latest changes from the repository
git pull origin main
# Install dependencies
npm install
# Build the application
npm run build
# Start or restart the application using pm2
pm2 start npm --name "optimizedcvui" -- start
