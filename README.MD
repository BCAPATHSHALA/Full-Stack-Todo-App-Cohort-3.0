# Todo App ( How to play with Cookie, Local, session storage, and request headers )

A Node.js Todo App built with Express.js, JSON Web Tokens (JWT), and file system storage.

## Features

### User Management

- **Signup**: Create a new user account with a unique username and password.
- **Login**: Authenticate an existing user and generate a JWT token for authorization.
- **Logout**: Clear the JWT token and log out the user.

### Todo Management

- **Create Todo**: Create a new todo item with a task description.
- **Fetch All Todos**: Retrieve all todo items for the authenticated user.
- **Update Todo**: Mark a todo item as done or undone.
- **Delete Todo**: Remove a todo item from the list.

### Authentication and Authorization

- **JWT token-based authentication**: Secure access to protected routes using JSON Web Tokens.
- **Middleware to parse cookies and authenticate users**: Authenticate users using cookies and JWT tokens.
- **Route protection using the `isAuthenticated` middleware**: Protect routes from unauthorized access.

## Getting Started

### Installation

1. Clone the repository: `git clone https://github.com/BCAPATHSHALA/Full-Stack-Todo-App-Cohort-3.0.git`
2. Install dependencies: `npm install`
3. Start the server: `node run dev`

### Usage

1. Open a web browser and navigate to `http://localhost:3000`
2. Signup or login to create a new user account or authenticate an existing one.
3. Create, update, and delete todo items using the provided routes.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **JSON Web Tokens (JWT)**: Token-based authentication
- **File system storage**: Store user data and todo items in a JSON file

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/BCAPATHSHALA/Full-Stack-Todo-App-Cohort-3.0/main/COOKIE%2C%20SESSION%2C%20LOCAL%20STORAGE%2C%20AND%20REQ%20HEADERS.png" alt="Todo App Screenshot">
</p>

## Video Explanation

[Todo App Video](https://youtu.be/RVqufPp_1GY)

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.
