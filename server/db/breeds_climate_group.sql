-- =====================
-- Breed Climate Groups
-- =====================

-- breeds.climate holds a detailed description (e.g. "Wet upland climates").
-- climate_group holds a short, shared category (e.g. "Hill & Upland")
-- so the Breed Explorer can filter by climate.
-- IF NOT EXISTS makes this file safe to run more than once.

ALTER TABLE breeds
  ADD COLUMN IF NOT EXISTS climate_group TEXT;
