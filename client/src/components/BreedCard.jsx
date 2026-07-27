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
        <strong>Wool characteristics:</strong> {breed.lock_characteristics}
      </p>

      <p>
        <strong>Drape:</strong> {breed.drape}
      </p>

      <p>
        <strong>Felting:</strong> {breed.feltability}
      </p>

      <p>
        <strong>Climate:</strong> {breed.climate}
      </p>

      <p>
        <strong>Notes:</strong> {breed.notes}
      </p>

      <div>
        <strong>Wool ratings:</strong>
        <ul>
          <li>Softness: {breed.softness}/5</li>
          <li>Drape: {breed.drape_rating}/5</li>
          <li>Elasticity: {breed.elasticity}/5</li>
          <li>Lustre: {breed.lustre}/5</li>
          <li>Felting: {breed.felting}/5</li>
          <li>Next to skin: {breed.next_to_skin}/5</li>
        </ul>
      </div>

    </div>
  );
}