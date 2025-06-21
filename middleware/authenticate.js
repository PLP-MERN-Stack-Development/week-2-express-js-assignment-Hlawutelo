// Authentication Middleware
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'your_api_key_here') {
        return next(new Error('Unauthorized: Invalid API key'));
    }
    next();
};

module.exports = authenticate;