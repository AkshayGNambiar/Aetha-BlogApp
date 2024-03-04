##Building a RESTful API with Node.js and Express
This is a RESTful API for managing a blog application. Users can register, log in, create, update, and delete blog posts.

#Project Structure<br>
The project structure is organized as follows:<br>

##Controllers: Contains controller functions to handle requests.<br>
##Models: Contains Mongoose models for user and post entities.<br>
##Routes: Defines routes for handling HTTP requests.<br>
##Middleware: Contains middleware functions for authentication and request validation.<br>
##.env: Stores environment variables.<br>
##server.js: Entry point of the application<br>



Blog App 
Setup<br><br>
Clone the repository:<br>

Install dependencies:<br><br>

npm install<br>
Set up MongoDB:<br><br>

 Make sure MongoDB is installed and running.<br>
 Create a MongoDB database named blog_app.<br>
Set environment variables:<br><br>

 Create a .env file in the root directory.<br>
Add the following environment variables:<br>

 PORT=3000<br>
 JWT_SECRET=Akshay<br>
Start the server:<br><br>
 npm start<br>

 


Blog App API<br><br>

##API Endpoints<br>
#Authentication<br>
 *1.POST /api/auth/register: Register a new user.<br>
 *2.POST /api/auth/login: Log in a user and receive a JWT.<br>
 *3.POST /api/auth/logout: Log out a user.<br>
#Blog Posts<br>
 *1.GET /api/posts: Fetch all blog posts.<br>
 *2.POST /api/posts: Create a new blog post (authenticated users only).<br>
 *3.GET /api/posts/:postId: Fetch a specific blog post.<br>
 *4.PUT /api/posts/:postId: Update a specific blog post (authenticated users only).<br>
 *5.DELETE /api/posts/:postId: Delete a specific blog post (authenticated users only).<br>
 Libraries used:<br><br>
 ##Express-For creating RestApis<br>
 ##body-parser-dealing with JSON data<br>
 ##bcrypt-For hashing the password<br>
 ##Mongoose-Connecting with database<br>
 ##ZOD-for validating the data coming from  requests<br>
