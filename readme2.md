To use this project, follow these steps:

To use your Express API server, follow these steps:

### 1. Install Dependencies
Open your terminal in the project folder and run:
```
npm install express body-parser uuid
```

### 2. Start the Server
In the same terminal, run:
```
node server.js
```
You should see:
```
Server is running on http://localhost:3000
```

### 3. Access the API
- Open your browser and go to [http://localhost:3000](http://localhost:3000)  
  You should see a welcome message.

#### Example API Endpoints:
- **List all products:**  
  [http://localhost:3000/api/products](http://localhost:3000/api/products)
- **Get product by ID:**  
  [http://localhost:3000/api/products/1](http://localhost:3000/api/products/1)
- **Product stats:**  
  [http://localhost:3000/api/products/stats](http://localhost:3000/api/products/stats)

#### For POST, PUT, DELETE requests:
- Use a tool like [Postman](https://www.postman.com/) or [curl](https://curl.se/).
- For POST/PUT, set header `x-api-key: my-secret-key` and send JSON body.

**Example curl command to add a product:**
```
curl -X POST http://localhost:3000/api/products ^
 -H "Content-Type: application/json" ^
 -H "x-api-key: my-secret-key" ^
 -d "{\"name\":\"Tablet\",\"description\":\"Android tablet\",\"price\":200,\"category\":\"electronics\",\"inStock\":true}"
```