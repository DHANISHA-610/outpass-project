const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');
const User = require('./backend/models/User');

// Load .env
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    promptUserLoop();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user inputs in loop
function promptUserLoop() {
  rl.question('\nDo you want to add a new user? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log("Exiting...");
      rl.close();
      mongoose.disconnect();
      return;
    }

    rl.question('Enter username: ', (username) => {
      rl.question('Enter password: ', async (password) => {
        rl.question('Enter role (student or warden): ', async (role) => {
          if (!['student', 'warden'].includes(role)) {
            console.log("Invalid role. Must be 'student' or 'warden'.");
            return promptUserLoop(); // ask again
          }

          try {
            const existing = await User.findOne({ username, role });
            if (existing) {
              console.log("User with same username and role already exists.");
              return promptUserLoop(); // skip and ask again
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ username, password: hashedPassword, role });

            console.log("User created successfully!");
            promptUserLoop(); // loop again
          } catch (err) {
            console.error(" Error creating user:", err.message);
            rl.close();
            mongoose.disconnect();
          }
        });
      });
    });
  });
}
