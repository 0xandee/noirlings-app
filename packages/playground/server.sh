#!/bin/bash

# Build the application
echo "Building the application..."
yarn build

# Start the server with the Node.js flag to use ES modules
echo "Starting the server..."
node --experimental-specifier-resolution=node src/server/server.js 