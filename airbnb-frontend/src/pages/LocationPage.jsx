/**
 * LocationPage.jsx
 *
 * Displays a filterable list of accommodation listings for a given location.
 *
 * The location name comes from the URL parameter (:locationName) set when the
 * user clicks a destination card on the home page or searches via the header.
 *
 * Filters (client-side, applied on top of the fetched data):
 *  - Property type  — dropdown populated from unique types in the results
 *  - Max price      — numeric input that hides listings above the threshold
 *
 * Each listing card links to the Location Details page (/listing/:id).
 */
import "./LocationPage.css";
import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/home/Footer";

const LocationPage = () => {
  // The city/area name extracted from the URL, e.g. "Cape Town"
  const { locationName } = useParams();

  // All listings for this location fetched from the API
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Active filter values
  const [filterType, setFilterType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ---------------------------------------------------------------------------
  // Data fetching — re-runs whenever the location in the URL changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");

      // Reset filters when navigating to a new location
      setFilterType("");
      setMaxPrice("");

      try {
        // Use the server-side location filter for efficiency
        const response = await api.get("/accommodations", {
          params: { location: locationName, limit: 50 },
        });

        // The API returns { accommodations, page, totalPages, total }
        const data = response.data.accommodations ?? response.data;
        setListings(data);
      } catch (err) {
        setError("Failed to load listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [locationName]);

  // ---------------------------------------------------------------------------
  // Client-side filtering
  // ---------------------------------------------------------------------------

  /**
   * Derive unique property types from the fetched listings for the dropdown.
   * Memoised so it only recalculates when listings change.
   */
  const uniqueTypes = useMemo(
    () => [...new Set(listings.map((l) => l.type).filter(Boolean))],
    [listings]
  );

  /**
   * Apply type and max-price filters on top of the full listings array.
   * Both filters are independent — a listing must pass both to be shown.
   */
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Property type filter: case-insensitive partial match
      const matchesType =
        !filterType ||
        listing.type.toLowerCase().includes(filterType.toLowerCase());

      // Max price filter: only hide listings that are strictly over the limit
      const matchesPrice =
        !maxPrice || listing.price <= Number(maxPrice);

      return matchesType && matchesPrice;
    });
  }, [listings, filterType, maxPrice]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) return <p className="page-container">Loading...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;

  return (
    <div className="page-container">
      {/* Page heading: shows total count for the location */}
      <h1>
        {listings.length} accommodation{listings.length !== 1 ? "s" : ""} in{" "}
        {locationName}
      </h1>

      {listings.length === 0 ? (
        <p>No accommodations found for this location.</p>
      ) : (
        <>
          {/* ── Filter bar ── */}
          <div className="location-filter-bar">
            {/* Property type dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="location-filter-select"
              aria-label="Filter by property type"
            >
              <option value="">All property types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Max price per night input */}
            <div className="location-filter-price">
              <label htmlFor="maxPrice">Max price / night (R)</label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                placeholder="e.g. 1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="location-filter-input"
              />
            </div>

            {/* Clear filters — only visible when at least one filter is active */}
            {(filterType || maxPrice) && (
              <button
                className="location-filter-clear"
                onClick={() => {
                  setFilterType("");
                  setMaxPrice("");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results summary */}
          <p className="location-results-count">
            Showing {filteredListings.length} of {listings.length} listing
            {listings.length !== 1 ? "s" : ""}
          </p>

          {/* Listing cards */}
          {filteredListings.length === 0 ? (
            <p>No listings match your filters.</p>
          ) : (
            <div className="location-listings">
              {filteredListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/listing/${listing._id}`}
                  className="location-listing-card"
                >
                  {/* Listing thumbnail */}
                  {listing.images?.[0] && (
                    <img src={listing.images[0]} alt={listing.title} />
                  )}

                  {/* Listing details */}
                  <div className="location-listing-details">
                    {/* Property type (e.g. "Entire apartment") */}
                    <h3>{listing.type}</h3>

                    {/* Listing title */}
                    <p>{listing.title}</p>

                    {/* Amenities as a comma-separated list */}
                    <p>{listing.amenities?.join(", ")}</p>

                    {/* Star rating and review count */}
                    <p>
                      ⭐ {listing.rating || "New"} · {listing.reviews || 0}{" "}
                      reviews
                    </p>

                    {/* Nightly price */}
                    <p>R{listing.price} / night</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default LocationPage;
