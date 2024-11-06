// app.ts
import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  user: 'myuser',              // POSTGRES_USER in your docker-compose.yml
  host: 'localhost',            // Host is 'localhost' because Docker binds it to your machine’s localhost
  database: 'mydatabase',       // POSTGRES_DB in your docker-compose.yml
  password: 'mypassword',       // POSTGRES_PASSWORD in your docker-compose.yml
  port: 5432,                   // Default PostgreSQL port
});

// Define a TypeScript interface for the user table
interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

// Function to get all users from the database
async function getAllUsers(): Promise<User[]> {
  const client = await pool.connect();  // Get a connection from the pool
  try {
    const res = await client.query<User>('SELECT * FROM users');  // Run the query
    return res.rows;  // Return the result rows
  } finally {
    client.release();  // Release the client back to the pool
  }
}

// Main function to fetch and display users
async function main() {
  try {
    const users = await getAllUsers();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await pool.end();  // Close the pool when done
  }
}

// Run the main function
main();
