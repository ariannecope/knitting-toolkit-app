import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import config from "../config.js";


// =====================
// Seed Climate Groups
// =====================

// This script adds the breeds.climate_group column (if needed) and fills it
// by matching each breed's detailed climate text to a short group name.
// Run it from the server folder with: npm run seed:climate-groups
//
// It is safe to run more than once:
// - The column uses ADD COLUMN IF NOT EXISTS.
// - Each run sets climate_group from the mapping below, so reruns give the same result.
// - Everything runs inside one transaction. If any breed has a climate that
//   isn't in the mapping, nothing is saved and the script lists what's missing.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schemaPath = path.join(__dirname, "breeds_climate_group.sql");


// Detailed climate text (breeds.climate) -> climate group.
// To regroup a climate, change it here and rerun the script.
const climateGroups = {
  "Temperate": "Temperate",
  "Temperate pasture": "Temperate",
  "Cool temperate": "Temperate",
  "Grass-based systems": "Temperate",
  "Pasture-based systems": "Temperate",
  "Mild maritime climate": "Temperate",
  "Adaptable": "Temperate",

  "Cool climates": "Cool & Wet",
  "Cool moist climates": "Cool & Wet",
  "Wet climates": "Cool & Wet",
  "Northern coastal climates": "Cool & Wet",

  "Cold climates": "Cold & Northern",
  "Scandinavian climate": "Cold & Northern",
  "Windy island climate": "Cold & Northern",
  "Island and wild environments": "Cold & Northern",

  "Harsh upland climates": "Hill & Upland",
  "Wet upland climates": "Hill & Upland",
  "Hill country": "Hill & Upland",
  "Upland pasture": "Hill & Upland",

  "Arid high desert": "Dry & Arid",
  "Dry inland climates": "Dry & Arid",
};


// =====================
// Database Setup
// =====================

// Same connection settings as server/index.js
const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});


// =====================
// Run Seed
// =====================

async function seed() {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(fs.readFileSync(schemaPath, "utf8"));

    const breeds = await client.query(
      "SELECT breed_id, breed_name, climate FROM breeds ORDER BY breed_name;"
    );

    // Stop if any breed's climate isn't covered by the mapping
    const unmapped = breeds.rows.filter((breed) => !climateGroups[breed.climate]);

    if (unmapped.length > 0) {
      throw new Error(
        "No climate group for: " +
          unmapped.map((breed) => `${breed.breed_name} ("${breed.climate}")`).join(", ")
      );
    }

    for (const breed of breeds.rows) {
      await client.query(
        "UPDATE breeds SET climate_group = $1 WHERE breed_id = $2;",
        [climateGroups[breed.climate], breed.breed_id]
      );
    }

    await client.query("COMMIT");

    console.log(`Set climate groups for ${breeds.rows.length} breeds.`);
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}


seed()
  .catch((error) => {
    console.error("Seed failed, no changes were saved:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
