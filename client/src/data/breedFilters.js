// Filter definitions for the Breed Explorer's "Find Your Perfect Fleece" panel.
// The page uses these to filter breeds, and FleeceFinder uses them to build the dropdowns.


// Starting value for every filter ("all" / false means the filter is off)
export const emptyFilters = {
  origin: "all",
  climate: "all",
  micron: "all",
  softness: "all",
  nextToSkin: false,
  drape: "all",
  elasticity: "all",
  lustre: "all",
  felting: "all",
};


// 1-5 ratings shown as Low / Medium / High dropdowns.
// key = filter name, column = field on the breed record
export const ratingFilters = [
  { key: "softness", column: "softness", label: "Softness" },
  { key: "drape", column: "drape_rating", label: "Drape" },
  { key: "elasticity", column: "elasticity", label: "Elasticity" },
  { key: "lustre", column: "lustre", label: "Lustre" },
  { key: "felting", column: "felting", label: "Felting" },
];

export const ratingLevels = [
  { value: "low", label: "Low (1–2)" },
  { value: "medium", label: "Medium (3)" },
  { value: "high", label: "High (4–5)" },
];


// Fiber diameter grades, based on the middle of each breed's micron range
export const micronGrades = [
  { value: "fine", label: "Fine (under 25 microns)" },
  { value: "medium", label: "Medium (25–30 microns)" },
  { value: "strong", label: "Strong (over 30 microns)" },
];


// Turn a 1-5 rating into "low", "medium", or "high"
export function ratingLevel(rating) {
  if (rating <= 2) return "low";
  if (rating === 3) return "medium";
  return "high";
}


// Grade a breed by the middle of its micron range
export function micronGrade(breed) {
  const middle = (breed.micron_min + breed.micron_max) / 2;

  if (middle < 25) return "fine";
  if (middle <= 30) return "medium";
  return "strong";
}


// True if the breed passes every active filter
export function breedMatchesFilters(breed, filters) {
  const matchesOrigin =
    filters.origin === "all" || breed.country_of_origin === filters.origin;

  const matchesClimate =
    filters.climate === "all" || breed.climate_group === filters.climate;

  const matchesMicron =
    filters.micron === "all" || micronGrade(breed) === filters.micron;

  // next_to_skin is a 1-5 rating; 4 or higher counts as next-to-skin soft
  const matchesNextToSkin = !filters.nextToSkin || breed.next_to_skin >= 4;

  const matchesRatings = ratingFilters.every(
    ({ key, column }) =>
      filters[key] === "all" || ratingLevel(breed[column]) === filters[key]
  );

  return (
    matchesOrigin &&
    matchesClimate &&
    matchesMicron &&
    matchesNextToSkin &&
    matchesRatings
  );
}


// How many filters are switched on (shown on the panel button)
export function countActiveFilters(filters) {
  return Object.keys(emptyFilters).filter(
    (key) => filters[key] !== emptyFilters[key]
  ).length;
}
