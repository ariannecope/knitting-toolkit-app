import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import config from "../config.js";


// =====================
// Seed Breed Images
// =====================

// This script creates the breed_images table (if needed) and links each
// of Arianne's illustrations to its existing breed record.
// Run it from the server folder with: npm run seed:breed-images
//
// It is safe to run more than once:
// - The table and index use IF NOT EXISTS.
// - Each image is upserted by its unique image_path, so reruns update rows
//   instead of creating duplicates.
// - Everything runs inside one transaction. If any breed can't be matched,
//   any image file is missing, or a breed already has a different primary
//   image, nothing is saved.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schemaPath = path.join(__dirname, "breed_images.sql");
const publicDir = path.join(__dirname, "../../client/public");


// Details shared by all of Arianne's illustrations
const illustrationDetails = {
  image_type: "illustration",
  creator: "Arianne Cope",
  source: "Original artwork",
  license: "All rights reserved",
  attribution: "Illustration by Arianne Cope",
};


// One entry per illustration.
// breed_name must match breeds.breed_name exactly.
const illustrations = [
  { breed_name: "Balwen Welsh Mountain", file: "balwen-welsh-mountain.jpg", alt_text: "Pencil sketch of a dark-fleeced Balwen Welsh Mountain sheep with a white blaze down its face, standing in grass beside a smaller dark lamb." },
  { breed_name: "Bluefaced Leicester", file: "bluefaced-leicester.jpg", alt_text: "Pencil sketch of a Bluefaced Leicester sheep standing side-on in grass, with a long narrow face, upright ears, and a crimped fleece." },
  { breed_name: "Border Cheviot", file: "border-cheviot.jpg", alt_text: "Pencil sketch of a Border Cheviot sheep standing side-on in grass, with a clean white face and tall, upright, pointed ears." },
  { breed_name: "Border Leicester", file: "border-leicester.jpg", alt_text: "Pencil sketch of a Border Leicester sheep in grass, looking back over its shoulder with tall, upright ears and a Roman nose." },
  { breed_name: "Cormo", file: "cormo.jpg", alt_text: "Pencil sketch of a Cormo sheep standing side-on, with a dense, even fleece covering its body and the top of its head." },
  { breed_name: "Corriedale", file: "corriedale.jpg", alt_text: "Pencil sketch of a woolly Corriedale ewe facing forward in grass, with a lamb standing on each side of her." },
  { breed_name: "Dorset", file: "dorset.jpg", alt_text: "Pencil sketch of a polled Dorset sheep standing side-on with its head raised, showing a smooth, close fleece." },
  { breed_name: "Finnsheep", file: "finnsheep.jpg", alt_text: "Pencil sketch of a full-fleeced Finnsheep standing in grass, turning its head toward the viewer." },
  { breed_name: "Gotland", file: "gotland.jpg", alt_text: "Pencil sketch of a Gotland sheep with a dark head and legs and a fleece drawn in tight, curly loops." },
  { breed_name: "Icelandic", file: "icelandic.jpg", alt_text: "Pencil sketch of a horned Icelandic sheep standing in grass, with a long, shaggy fleece hanging below its belly." },
  { breed_name: "Jacob", file: "jacob.jpg", alt_text: "Pencil sketch of a four-horned Jacob sheep facing the viewer in grass, with two tall upright horns, two curving side horns, and a patchy piebald fleece." },
  { breed_name: "Leicester Longwool", file: "leicester-longwool.jpg", alt_text: "Pencil sketch of a Leicester Longwool sheep standing side-on, with long, wavy wool hanging in locks nearly to the ground." },
  { breed_name: "Lincoln", file: "lincoln.jpg", alt_text: "Pencil sketch of a Lincoln sheep standing in grass, with long, curly locks covering its body and falling over its face." },
  { breed_name: "Merino", file: "merino.jpg", alt_text: "Pencil sketch of a horned Merino ram facing the viewer, with spiral horns and deep folds of wool around its neck." },
  { breed_name: "Navajo-Churro", file: "navajo-churro.jpg", alt_text: "Pencil sketch of a Navajo-Churro sheep standing side-on, with a long, straight-hanging fleece and small curved horns." },
  { breed_name: "North Country Cheviot", file: "north-country-cheviot.jpg", alt_text: "Pencil sketch of a sturdy North Country Cheviot sheep standing in tall grass, with a clean face and upright ears." },
  { breed_name: "Ouessant", file: "ouessant.jpg", alt_text: "Pencil sketch of a horned Ouessant ram facing the viewer in grass, with curled horns and a thick, shaggy mane of wool." },
  { breed_name: "Polwarth", file: "polwarth.jpg", alt_text: "Pencil sketch of a Polwarth sheep standing in grass, with a dense fleece that covers its head and legs." },
  { breed_name: "Rambouillet", file: "rambouillet.jpg", alt_text: "Pencil sketch of a young Rambouillet ram with small curved horns, standing three-quarter view and looking toward the viewer." },
  { breed_name: "Romney", file: "romney.jpg", alt_text: "Pencil sketch of a Romney sheep facing the viewer in grass, with a full, wavy fleece and a woolly topknot." },
  { breed_name: "Scottish Blackface", file: "scottish-blackface.jpg", alt_text: "Pencil sketch of a Scottish Blackface ram facing the viewer, with a black face, large curling horns, speckled legs, and a long, coarse fleece." },
  { breed_name: "Shetland", file: "shetland.jpg", alt_text: "Pencil sketch of a horned Shetland ram standing in grass, with spiral horns, a light face, and a full fleece." },
  { breed_name: "Shropshire", file: "shropshire.jpg", alt_text: "Pencil sketch of a Shropshire sheep standing side-on in grass, with a dark face and ears and a dense fleece." },
  { breed_name: "Soay", file: "soay.jpg", alt_text: "Pencil sketch of a small, dark Soay sheep with curved horns, standing side-on and looking toward the viewer." },
  { breed_name: "Southdown", file: "southdown.jpg", alt_text: "Pencil sketch of a compact, woolly Southdown sheep standing in grass, with a short face looking toward the viewer." },
  { breed_name: "Suffolk", file: "suffolk.jpg", alt_text: "Pencil sketch of a Suffolk sheep standing side-on, with a black head, black legs, and a short, light fleece." },
  { breed_name: "Teeswater", file: "teeswater.jpg", alt_text: "Pencil sketch of a Teeswater sheep facing the viewer, with long, curly locks, a dark face, and speckled legs." },
  { breed_name: "Welsh Mountain", file: "welsh-mountain.jpg", alt_text: "Pencil sketch of a small Welsh Mountain sheep standing side-on, with a light face and a thick fleece." },
  { breed_name: "Wensleydale", file: "wensleydale.jpg", alt_text: "Pencil sketch of a Wensleydale sheep standing in grass, with a dark face and long, ringleted locks hanging to the ground." },
];


// =====================
// Database Setup
// =====================

// Same connection settings as server/index.js
const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});


// =====================
// Helper Functions
// =====================

// Find the one breed with this exact name.
// Throws if there is no match or more than one match.
async function findBreedId(client, breedName) {
  const result = await client.query(
    "SELECT breed_id FROM breeds WHERE breed_name = $1;",
    [breedName]
  );

  if (result.rows.length !== 1) {
    throw new Error(
      `Expected exactly 1 breed named "${breedName}", found ${result.rows.length}`
    );
  }

  return result.rows[0].breed_id;
}


// Stop if this breed already has a different primary image,
// so we never silently replace one.
async function checkPrimaryConflict(client, breedId, imagePath) {
  const result = await client.query(
    `
    SELECT image_path
    FROM breed_images
    WHERE breed_id = $1 AND is_primary AND image_path <> $2;
    `,
    [breedId, imagePath]
  );

  if (result.rows.length > 0) {
    throw new Error(
      `Breed ${breedId} already has a different primary image: ${result.rows[0].image_path}`
    );
  }
}


// Insert the image, or update it if this image_path already exists
async function upsertImage(client, breedId, image) {
  await client.query(
    `
    INSERT INTO breed_images
      (breed_id, image_path, alt_text, image_type, creator, source, license, attribution, is_primary)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
    ON CONFLICT (image_path) DO UPDATE SET
      breed_id    = EXCLUDED.breed_id,
      alt_text    = EXCLUDED.alt_text,
      image_type  = EXCLUDED.image_type,
      creator     = EXCLUDED.creator,
      source      = EXCLUDED.source,
      license     = EXCLUDED.license,
      attribution = EXCLUDED.attribution,
      is_primary  = EXCLUDED.is_primary;
    `,
    [
      breedId,
      image.image_path,
      image.alt_text,
      image.image_type,
      image.creator,
      image.source,
      image.license,
      image.attribution,
    ]
  );
}


// =====================
// Run Seed
// =====================

async function seed() {
  // Check the image files exist before touching the database
  const missingFiles = illustrations.filter(
    (item) => !fs.existsSync(path.join(publicDir, "images/breeds", item.file))
  );

  if (missingFiles.length > 0) {
    throw new Error(
      `Missing image files: ${missingFiles.map((item) => item.file).join(", ")}`
    );
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(fs.readFileSync(schemaPath, "utf8"));

    for (const item of illustrations) {
      const breedId = await findBreedId(client, item.breed_name);
      const image = {
        ...illustrationDetails,
        image_path: `/images/breeds/${item.file}`,
        alt_text: item.alt_text,
      };

      await checkPrimaryConflict(client, breedId, image.image_path);
      await upsertImage(client, breedId, image);
    }

    await client.query("COMMIT");

    console.log(`Seeded ${illustrations.length} breed images.`);
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
