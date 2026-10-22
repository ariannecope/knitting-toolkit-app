-- =====================
-- Breed Images Table
-- =====================

-- Each row links one image file to one breed.
-- The image itself lives in client/public/images/breeds;
-- the database only stores its path plus creator and licensing details.
-- IF NOT EXISTS makes this file safe to run more than once.

CREATE TABLE IF NOT EXISTS breed_images (
  image_id    SERIAL PRIMARY KEY,
  breed_id    INTEGER NOT NULL REFERENCES breeds(breed_id) ON DELETE CASCADE,
  image_path  TEXT NOT NULL UNIQUE,      -- e.g. /images/breeds/merino.jpg
  alt_text    TEXT NOT NULL,
  image_type  TEXT NOT NULL,             -- e.g. illustration, photograph
  creator     TEXT NOT NULL,
  source      TEXT,                      -- e.g. Original artwork
  source_url  TEXT,                      -- for images that come from elsewhere
  license     TEXT,                      -- e.g. All rights reserved
  attribution TEXT,                      -- the credit line shown in the app
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- A breed can have many images, but only one primary image.
-- This partial unique index only applies to rows where is_primary is true.

CREATE UNIQUE INDEX IF NOT EXISTS breed_images_one_primary
  ON breed_images (breed_id)
  WHERE is_primary;
