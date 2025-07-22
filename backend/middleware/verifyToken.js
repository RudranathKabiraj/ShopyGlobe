import jwt from 'jsonwebtoken';

// Middleware function to verify the JWT token sent by the client
const verifyToken = (req, res, next) => {
  // Get the Authorization header from the incoming request
  const authHeader = req.headers.authorization;

  // If the header is missing or doesn't start with "Bearer ", the user is not authorized
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Extract the token part from the header (after "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user ID from the decoded token payload
    // The token might have either '_id' (MongoDB-style) or 'id' field, so we support both
    const userId = decoded._id || decoded.id;

    // If the token does not contain a user ID, it's invalid
    if (!userId) {
      return res.status(403).json({ message: 'Invalid token payload: Missing user ID' });
    }

    // Attach the user ID to the request object so it can be used in the next middleware or route handler
    req.user = { _id: userId };

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If the token verification fails (e.g., expired or tampered), return an error
    console.error('Token verification failed:', err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
