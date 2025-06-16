# Step 1: Build app
FROM node:18 AS builder
WORKDIR /app

# Copy only necessary files first for better caching
COPY package*.json ./
RUN npm install

# Now copy the actual app files
COPY . .

# Ensure 'src/index.jsx' and 'index.html' exist
RUN test -f ./src/index.jsx || (echo "ERROR: src/index.jsx missing!" && exit 1)
RUN test -f ./index.html || (echo "ERROR: index.html missing!" && exit 1)

RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
