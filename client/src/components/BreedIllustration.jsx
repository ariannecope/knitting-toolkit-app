// Shows a breed's primary image with its alt text and credit line.
// The image path, alt text, and attribution all come from the breed_images table.
// Renders nothing if the breed doesn't have an image yet.

export default function BreedIllustration({ breed }) {
  if (!breed.image_path) {
    return null;
  }

  return (
    <figure className="breed-illustration">
      <img src={breed.image_path} alt={breed.image_alt} loading="lazy" />

      {breed.image_attribution && (
        <figcaption className="image-credit">{breed.image_attribution}</figcaption>
      )}
    </figure>
  );
}
