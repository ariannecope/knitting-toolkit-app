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

async function addOneUser(
  name,
  country_name,
  email,
  bio
) {
  // db.query() sends a SQL command to PostgreSQL.
  // await pauses this function until the database finishes the query.
  // The result variable stores the response from the database.
  const result = await db.query(
    `
    INSERT INTO users (name, country_name, email, bio)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [
      name,
      country_name,
      email,
      bio
    ]
  );

  // result.rows is an array containing the rows returned by PostgreSQL.
  // Since we only inserted one user, we return the first (and only) row.
  return result.rows[0];
}

// Retrieves the newest user from the database.
//
// The database sorts users from newest to oldest using user_id DESC.
// LIMIT 1 makes sure we only get the newest user.

async function getNewestUser() {

  const result = await db.query(`
    SELECT *
    FROM users
    ORDER BY user_id DESC
    LIMIT 1;
  `);

  // Return the rows from the database.
  // This will be an array containing the newest user.
  return result.rows;
}

//update country count helper function that expects one piece of information-country name
async function updateOneCountryCount(country_name) {

  //On Conflict: If a country with this name already exists...increase the existing count by one.
  const result = await db.query(
    `
    INSERT INTO country_counts (country_name, count)
    VALUES ($1, 1)
    ON CONFLICT (country_name)
    DO UPDATE SET count = country_counts.count + 1
    RETURNING count;
    `,
    [
      country_name
    ]
  );
//Send this SQL to PostgreSQL and wait for the answer. VALUES ('France', 1)
//takes the first row and gives it back to whoever called this helper.
  return result.rows[0];
}

// Retrieves all saved countries from the database.
async function getAllSavedCountries() {

  const result = await db.query(`
    SELECT country_name
    FROM saved_countries;
  `);

  return result.rows;

}


// Saves a country name into the saved_countries table.
// If the country already exists, PostgreSQL ignores the duplicate.
async function saveOneCountry(country_name) {

  const result = await db.query(
    `
    INSERT INTO saved_countries (country_name)
    VALUES ($1)
    ON CONFLICT (country_name) DO NOTHING
    RETURNING *;
    `,
    [
      country_name
    ]
  );

  return result.rows[0];
}

// =====================
// API Endpoints
// =====================

// This endpoint listens for a POST request from the React form.
// The frontend sends formData using JSON.stringify().
// Express converts that JSON into req.body because of express.json().
app.post("/api/add-one-user", async (req, res) => {

  // Destructuring takes the properties from req.body
  // and creates individual variables we can pass into the helper function.
  //
  // Example:
  // req.body = {
  //   name: "Arianne",
  //   country_name: "Japan",
  //   email: "example@email.com",
  //   bio: "I love knitting."
  // }
  //
  // After destructuring:
  // name = "Arianne"
  // country_name = "Japan"
  // email = "example@email.com"
  // bio = "I love knitting."


  const {
    name,
    country_name,
    email,
    bio
  } = req.body;

    // Send the form data to the helper function.
  // The helper handles the database INSERT.
  const user = await addOneUser(
    name,
    country_name,
    email,
    bio
  );

  // Send a response back to the frontend.
  // React receives this as the response from fetch().
  res.send(`Success! Welcome, ${user.name}!`);

});



// This endpoint listens for a GET request from React.
// The frontend asks: "Do you already have a user?"
// The endpoint calls the helper function, which retrieves the newest user from the database.

app.get("/api/get-newest-user", async (req, res) => {

  // Call the helper function.
  // The helper handles the database SELECT query.
  const user = await getNewestUser();

  // Send the user data back to React as JSON.
  // React will receive this in response.json().
  res.json(user);

});

// This endpoint listens for a POST request from React.
// The frontend sends the name of the country the user is viewing.
// The endpoint calls the updateOneCountryCount helper function,
// which updates the country's view count in the database and returns the new count.
// The updated count is then sent back to React so it can be displayed on the CountryDetail page.

app.post("/api/update-one-country-count", async (req, res) => {

  const { country_name } = req.body;

  const updatedCount = await updateOneCountryCount(country_name);

  res.json(updatedCount);

});

// This endpoint listens for a GET request from React.
// React asks: "Which countries has the user saved?"
// The endpoint calls the helper function,
// which retrieves saved countries from PostgreSQL.

app.get("/api/get-all-saved-countries", async (req, res) => {

  const savedCountries = await getAllSavedCountries();

  res.json(savedCountries);

});


// This endpoint listens for a POST request from React.
// The frontend sends the selected country name.
// The endpoint calls the helper function,
// which saves the country in the database.

app.post("/api/save-one-country", async (req, res) => {

  const { country_name } = req.body;

  const savedCountry = await saveOneCountry(country_name);

  res.json(savedCountry);

});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Endpoint = receives the request
// Helper = performs the database action
// Database = stores the information