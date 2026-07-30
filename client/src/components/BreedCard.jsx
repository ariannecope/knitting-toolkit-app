import { Link } from "react-router-dom";

export default function BreedCard({ breed }) {
  return (
    <div className="breed-card">
      <h2>{breed.breed_name}</h2>

      <p>
        <strong>Family:</strong> {breed.family_name}
      </p>

      <p>
        <strong>Origin:</strong> {breed.country_of_origin}
      </p>

      <p>
        <strong>Wool:</strong> {breed.lock_characteristics}
      </p>

      <Link to={`/breeds/${breed.breed_id}`}>Learn more</Link>
    </div>
  );
}
