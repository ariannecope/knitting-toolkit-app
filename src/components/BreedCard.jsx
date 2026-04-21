export default function BreedCard({ breed }) {
  return (
    <div className="breed-card">
      <img src={breed.image} alt={breed.name} />
      <h2>{breed.name}</h2>

      <p><strong>Wool type:</strong> {breed.woolType}</p>

      <p><strong>Characteristics:</strong></p>
      <ul>
        {breed.characteristics.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <p><strong>Best for:</strong> {breed.bestFor.join(", ")}</p>
      <p><strong>Example projects:</strong> {breed.examples.join(", ")}</p>
    </div>
  );
}