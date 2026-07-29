import { useState, useEffect } from "react";
import BreedCard from "../components/BreedCard";
import SheepBreeds1 from "../assets/SheepBreeds1.JPG";

export default function BreedExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // basic filtering (works even with small dataset)
  const filteredBreeds = breeds.filter((breed) => {
    return breed.breed_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          />

          <input
            type="text"
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="breed-search"
          />

          {filteredBreeds.length === 0 && (
            <p>No breeds found. Try another search.</p>
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
