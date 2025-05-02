// Define the middleware function
const myMiddleware = (req, res, next) => {
    // Perform actions with the request and response objects
    console.log('Middleware executed for GET request');
    // Call next() to pass control to the next middleware/route handler
    next();
};
