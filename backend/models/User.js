// Import the mongoose library, which is used to interact with MongoDB
import mongoose from 'mongoose';

// Define the schema (structure) for a User document in the MongoDB database
const userSchema = new mongoose.Schema({

  // 'name' field stores the full name of the user (e.g., "John Doe")
  // It is a required string, which means it must be provided during registration
  name: { type: String, required: true },

  // 'email' field stores the user's email address (e.g., "john@example.com")
  // It is a required string and must be unique across all users
  // This ensures no two users can register with the same email
  email: { type: String, required: true, unique: true },

  // 'password' field stores the user's password in a hashed (encrypted) format
  // It is also required, but note: we do not store plain text passwords for security reasons
  password: { type: String, required: true }

}, { 
  // 'timestamps: true' automatically creates 'createdAt' and 'updatedAt' fields
  // These track when the user account was created and last modified
  timestamps: true 
});

// Create a Mongoose model called 'User' based on the schema defined above
// This will map to a 'users' collection in MongoDB
const User = mongoose.model('User', userSchema);

// Export the model so it can be used in other parts of the application,
// such as for user registration, login, and authentication
export default User;
