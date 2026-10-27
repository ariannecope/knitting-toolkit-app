import { useState, useEffect } from "react";
import BreedCard from "../components/BreedCard";
import FleeceFinder from "../components/FleeceFinder";
import { emptyFilters, breedMatchesFilters } from "../data/breedFilters";
import SheepBreeds1 from "../assets/SheepBreeds1.JPG";

export default function BreedExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("all");
  // extra filters from the "Find Your Perfect Fleece" panel
  const [filters, setFilters] = useState(emptyFilters);

  //get breeds
  useEffect(() => {
    async function getBreeds() {
      try {
        const response = await fetch("/api/get-all-breeds");

        if (!response.ok) {
          throw new Error("Failed to fetch breeds");
        }

        const data = await response.json();

        setBreeds(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getBreeds();
  }, []);

  //get families
  useEffect(() => {
    async function getFamilies() {
      try {
        const response = await fetch("/api/get-all-families");

        if (!response.ok) {
          throw new Error("Failed to fetch families");
        }

        const data = await response.json();

        setFamilies(data);
      } catch (error) {
        setError(error.message);
      }
    }

    getFamilies();
  }, []);

  // filtering
  const filteredBreeds = breeds.filter((breed) => {
    const matchesSearch = breed.breed_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFamily =
      selectedFamily === "all" || breed.family_id === Number(selectedFamily);

    return matchesSearch && matchesFamily && breedMatchesFilters(breed, filters);
  });

  // dropdown options for the panel, built from the breeds we loaded
  const origins = [...new Set(breeds.map((breed) => breed.country_of_origin))].sort();
  const climates = [...new Set(breeds.map((breed) => breed.climate_group))].sort();

  // update one panel filter and keep the others
  function updateFilter(key, value) {
    setFilters({ ...filters, [key]: value });
  }

  // reset the search box, family, and every panel filter
  function clearAllFilters() {
    setSearchTerm("");
    setSelectedFamily("all");
    setFilters(emptyFilters);
  }

  const isFiltered =
    searchTerm !== "" ||
    selectedFamily !== "all" ||
    filteredBreeds.length !== breeds.length;

  return (
    <div className="breed-explorer-page">
      {loading && <p>Loading sheep breeds...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <h1>Breed Explorer</h1>

          <p>
            Explore different sheep breeds and learn about their wool
            characteristics, texture, and ideal knitting projects.
          </p>

          <img
            src={SheepBreeds1}
            alt="A shepherdess surrounded by four shetland sheep"
            className="image-standard"
          />

          <div className="breed-controls">
            <input
              type="text"
              placeholder="Search breeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="breed-search"
            />

            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="breed-filter"
            >
              <option value="all">All Families</option>

              {families.map((family) => (
                <option key={family.family_id} value={family.family_id}>
                  {family.family_name}
                </option>
              ))}
            </select>
          </div>

          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>Clear</button>
          )}

          <FleeceFinder
            filters={filters}
            onChange={updateFilter}
            origins={origins}
            climates={climates}
          />

          <div className="breed-results-bar">
            <p className="breed-results-count" aria-live="polite">
              Showing {filteredBreeds.length} of {breeds.length} breeds
            </p>

            {isFiltered && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredBreeds.length === 0 && (
            <p>No breeds match all of these choices. Try loosening a filter.</p>
          )}

          <div className="breed-grid">
            {filteredBreeds.map((breed) => (
              <BreedCard key={breed.breed_id} breed={breed} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
