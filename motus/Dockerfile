# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the liste_francais_utf8.txt file
COPY data/liste_francais_utf8.txt ./data/liste_francais_utf8.txt
# Copy the rest of the code
COPY . .

# Start the application
CMD [ "node", "index.js" ]