import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BreedDetail() {
  const { id } = useParams();

  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getBreed() {
      try {
        const response = await fetch(`/api/get-breed/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch breed");
        }

        const data = await response.json();

        setBreed(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getBreed();
  }, [id]);

  if (loading) {
    return <p>Loading breed...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="breed-detail-page">
      <Link to="/breeds">← Back to Breed Explorer</Link>

      <h1>{breed.breed_name}</h1>

      <section className="breed-info-card">
        <h2>Breed Information</h2>

        <p>
          <strong>Family:</strong> {breed.family_name}
        </p>

        <p>
          <strong>Origin:</strong> {breed.country_of_origin}
        </p>

        <p>
          <strong>Climate:</strong> {breed.climate}
        </p>
      </section>

      <section className="breed-info-card">
        <h2>Fiber Characteristics</h2>

        <p>
          <strong>Lock characteristics:</strong> {breed.lock_characteristics}
        </p>

        <p>
          <strong>Drape:</strong> {breed.drape}
        </p>

        <p>
          <strong>Felting:</strong> {breed.feltability}
        </p>
      </section>

      <section className="breed-info-card">
        <h2>Wool Ratings</h2>

        <ul>
          <li>Softness: {breed.softness}/5</li>

          <li>Drape: {breed.drape_rating}/5</li>

          <li>Elasticity: {breed.elasticity}/5</li>

          <li>Lustre: {breed.lustre}/5</li>

          <li>Felting: {breed.felting}/5</li>

          <li>Next to skin: {breed.next_to_skin}/5</li>
        </ul>
      </section>

      <section className="breed-info-card">
        <h2>Notes</h2>

        <p>{breed.notes}</p>
      </section>
    </div>
  );
}