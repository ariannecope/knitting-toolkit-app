import { useState } from "react";
import {
  ratingFilters,
  ratingLevels,
  micronGrades,
  countActiveFilters,
} from "../data/breedFilters";

// Collapsible "Find Your Perfect Fleece" panel with the extra breed filters.
// The filter values live in BreedExplorer; this component only shows them
// and reports changes back through onChange(key, value).

export default function FleeceFinder({ filters, onChange, origins, climates }) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = countActiveFilters(filters);

  return (
    <div className="fleece-finder">
      <button
        type="button"
        className="fleece-finder-toggle"
        aria-expanded={isOpen}
        aria-controls="fleece-finder-panel"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="fleece-finder-arrow" aria-hidden="true">▸</span>
        Find Your Perfect Fleece
        {activeCount > 0 && ` (${activeCount} active)`}
      </button>

      {isOpen && (
        <div id="fleece-finder-panel" className="fleece-finder-panel">
          <p className="fleece-finder-intro">
            Dig into where each breed comes from and how its wool behaves, from
            next-to-skin softness to lustre, drape, and felting.
          </p>

          <div className="fleece-finder-grid">
            <label>
              Origin
              <select
                value={filters.origin}
                onChange={(e) => onChange("origin", e.target.value)}
              >
                <option value="all">Any country</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Climate
              <select
                value={filters.climate}
                onChange={(e) => onChange("climate", e.target.value)}
              >
                <option value="all">Any climate</option>
                {climates.map((climate) => (
                  <option key={climate} value={climate}>
                    {climate}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Fiber diameter
              <select
                value={filters.micron}
                onChange={(e) => onChange("micron", e.target.value)}
              >
                <option value="all">Any diameter</option>
                {micronGrades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </label>

            {ratingFilters.map(({ key, label }) => (
              <label key={key}>
                {label}
                <select
                  value={filters[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                >
                  <option value="all">Any</option>
                  {ratingLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <label className="fleece-finder-checkbox">
              <input
                type="checkbox"
                checked={filters.nextToSkin}
                onChange={(e) => onChange("nextToSkin", e.target.checked)}
              />
              Soft enough to wear next to skin
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
