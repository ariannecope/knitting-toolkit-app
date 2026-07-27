import express from "express";
import pg from "pg";
import config from "./config.js";


// =====================
// Database Setup
// =====================

// pg is the PostgreSQL library that allows JavaScript to communicate with our database.
// pg.Pool creates a pool of database connections that our server can reuse.
// We store this connection pool in a variable called db.
// Later, we will use db.query() to send SQL commands to PostgreSQL.

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});


// =====================
// Express Server Setup
// =====================

// express() creates our server application.
// The app variable represents our Express server.
const app = express();


// This middleware tells Express how to handle incoming JSON data.
// The frontend sends form data using JSON.stringify().
// express.json() converts that incoming JSON into a JavaScript object
// and stores it on req.body so our routes can access it.
//
// Example:
// Frontend sends:
// {
//   name: "Arianne",
//   country_name: "Japan"
// }
//
// Backend receives:
// req.body = {
//   name: "Arianne",
//   country_name: "Japan"
// }

app.use(express.json());


// =====================
// Helper Functions
// =====================

// Helper functions contain the database logic.
// They do not know about requests (req) or responses (res).
// Their job is to take values, run SQL, and return database results.

async function getAllBreeds() {
  const result = await db.query(`
    SELECT
      breeds.*,
      breed_families.family_name
    FROM breeds
    JOIN breed_families
    ON breeds.family_id = breed_families.family_id;
  `);

  return result.rows;
}

// async function getAllBreeds() {
//   const result = await db.query(`
//     SELECT *
//     FROM breeds;
//   `);

//   return result.rows;
// }


// =====================
// API Endpoints
// =====================

app.get("/api/get-all-breeds", async (req, res) => {
  const breeds = await getAllBreeds();

  res.json(breeds);
});


const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Endpoint = receives the request
// Helper = performs the database action
// Database = stores the information