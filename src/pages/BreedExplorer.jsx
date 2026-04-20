import SheepBreeds1 from "../assets/SheepBreeds1.jpg";

export default function BreedExplorer() {
  return (
    <div className="breed-page">
      <h1>Breed Explorer</h1>
      <p>Explore yarn and fiber characteristics by breed.</p>
      <img src={SheepBreeds1} alt="Shepherdess surrounded by her flock of different-colored sheep"/>

      <div className="breed-controls">
        <input
          type="text"
          placeholder="Search breeds..."
        />

        <select>
          <option value="">All fiber types</option>
          <option value="wool">Wool</option>
          <option value="alpaca">Alpaca</option>
          <option value="cotton">Cotton</option>
        </select>
      </div>

      <div className="breed-grid">
        <div className="breed-card">
          <h3>Merino</h3>
          <p>Soft, fine wool ideal for garments worn next to skin.</p>
        </div>

        <div className="breed-card">
          <h3>Alpaca</h3>
          <p>Warm, lightweight fiber with a silky feel.</p>
        </div>

        <div className="breed-card">
          <h3>Bluefaced Leicester</h3>
          <p>Strong, slightly lustrous wool with good stitch definition.</p>
        </div>
      </div>
    </div>
  );
}