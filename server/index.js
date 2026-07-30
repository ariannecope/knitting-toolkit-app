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

app.use(express.json());


// =====================
// Helper Functions
// =====================

// Helper functions contain the database logic.
// They do not know about requests (req) or responses (res).
// Their job is to take values, run SQL, and return database results.


// Get all breeds from the database
async function getAllBreeds() {
  const result = await db.query(
    `
    SELECT
      breeds.*,
      breed_families.family_name
    FROM breeds
    JOIN breed_families
    ON breeds.family_id = breed_families.family_id;
    `
  );

  return result.rows;
}


// Get one breed by its ID
async function getBreedById(id) {
  const result = await db.query(
    `
    SELECT
      breeds.*,
      breed_families.family_name
    FROM breeds
    JOIN breed_families
    ON breeds.family_id = breed_families.family_id
    WHERE breeds.breed_id = $1;
    `,
    [id]
  );

  return result.rows[0];
}


// =====================
// API Endpoints
// =====================


// Get all breeds endpoint
// This receives the request from the frontend,
// calls the helper function,
// and sends the database results back as JSON.

app.get("/api/get-all-breeds", async (req, res) => {
  try {
    const breeds = await getAllBreeds();

    res.json(breeds);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve breeds"
    });
  }
});


// Get one breed endpoint
// The :id comes from the URL.
// Example:
// /api/get-breed/5

app.get("/api/get-breed/:id", async (req, res) => {
  try {
    const breed = await getBreedById(req.params.id);

    if (!breed) {
      return res.status(404).json({
        error: "Breed not found"
      });
    }

    res.json(breed);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve breed"
    });
  }
});


// Endpoint = receives the request
// Helper = performs the database action
// Database = stores the information


// =====================
// Start Server
// =====================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});