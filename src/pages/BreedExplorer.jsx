import { useState } from "react";
import breeds from "../data";
import BreedCard from "../components/BreedCard";
import SheepBreeds1 from "../assets/SheepBreeds1.JPG";

export default function BreedExplorer() {
  const [searchTerm, setSearchTerm] = useState("");

  // basic filtering (works even with small dataset)
  const filteredBreeds = breeds.filter((breed) => {
    return breed.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="breed-explorer-page">
      <h1>Breed Explorer</h1>

      <p>
        Explore different sheep breeds and learn about their wool
        characteristics, texture, and ideal knitting projects.
      </p>

      <img src={SheepBreeds1} alt="A shepherdess surrounded by four shetland sheep"/>

      <input
        type="text"
        placeholder="Search breeds..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="breed-search"
      />

      <div className="breed-grid">
        {filteredBreeds.map((breed) => (
          <BreedCard key={breed.name} breed={breed} />
        ))}
      </div>
    </div>
  );
}