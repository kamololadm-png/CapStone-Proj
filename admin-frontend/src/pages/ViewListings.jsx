/**
 * ViewListings.jsx
 *
 * Displays all accommodation listings created by the currently logged-in host.
 *
 * Features:
 *  - Fetches only the listings owned by the authenticated host (server-side
 *    filter via ?location + client-side ownership filter as a fallback)
 *  - Live search/filter bar: filter by title/location keyword and property type
 *  - Update button navigates to the UpdateListing page
 *  - Delete button prompts for confirmation then removes the listing
 */

import "./ViewListings.css";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ViewListings = () => {
  // All listings fetched from the API (already filtered to this host's)
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state — controlled by the filter bar
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchListings();
  }, []);

  /**
   * Fetch all accommodations from the API, then keep only the ones
   * that belong to the currently logged-in host.
   */
  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/accommodations");
      // The API now returns { accommodations, page, totalPages, total }
      const all = response.data.accommodations ?? response.data;

      // Filter to only this host's listings
      const mine = all.filter(
        (listing) =>
          String(listing.host?._id || listing.host) === String(user._id)
      );

      setListings(mine);
    } catch (err) {
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete handler
  // ---------------------------------------------------------------------------

  /**
   * Prompt the host for confirmation, then DELETE the listing from the API
   * and remove it from local state on success.
   *
   * @param {string} id  The MongoDB ObjectId of the listing to delete
   */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await api.delete(`/accommodations/${id}`);
      // Optimistic UI update — remove from local state without re-fetching
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing.");
    }
  };

  // ---------------------------------------------------------------------------
  // Client-side filtering (runs on every render where state changes)
  // ---------------------------------------------------------------------------

  /**
   * Derive the visible listings by applying the search text and type filter
   * on top of the already-fetched listings array.
   * useMemo prevents re-computing on unrelated re-renders.
   */
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Text search: match against title or location (case-insensitive)
      const matchesText =
        !searchText ||
        listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchText.toLowerCase());

      // Type filter: exact match (case-insensitive)
      const matchesType =
        !filterType ||
        listing.type.toLowerCase().includes(filterType.toLowerCase());

      return matchesText && matchesType;
    });
  }, [listings, searchText, filterType]);

  // Derive unique property types from current listings for the type dropdown
  const uniqueTypes = useMemo(
    () => [...new Set(listings.map((l) => l.type).filter(Boolean))],
    [listings]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) return <p className="page-container">Loading listings...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;

  return (
    <div className="page-container">
      <h1>My Listings</h1>

      {/* Filter bar — only shown when there are listings to filter */}
      {listings.length > 0 && (
        <div className="filter-bar">
          {/* Free-text search across title and location */}
          <input
            type="text"
            placeholder="Search by title or location…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="filter-input"
            aria-label="Search listings"
          />

          {/* Type dropdown — options are derived from the actual listings */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
            aria-label="Filter by property type"
          >
            <option value="">All types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Clear filters button — only visible when a filter is active */}
          {(searchText || filterType) && (
            <button
              className="filter-clear"
              onClick={() => {
                setSearchText("");
                setFilterType("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Empty state messages */}
      {listings.length === 0 ? (
        <p>
          You haven't created any listings yet.{" "}
          <Link to="/create">Create your first listing</Link>
        </p>
      ) : filteredListings.length === 0 ? (
        <p>No listings match your filters.</p>
      ) : (
        <>
          {/* Results count */}
          <p className="results-count">
            Showing {filteredListings.length} of {listings.length} listing
            {listings.length !== 1 ? "s" : ""}
          </p>

          {/* Listings grid */}
          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="listing-card">
                {/* Listing thumbnail */}
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} />
                ) : (
                  <div className="listing-card-placeholder">No image</div>
                )}

                {/* Listing details */}
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <p className="listing-type">{listing.type}</p>
                <p>R{listing.price} / night</p>

                {/* Action buttons (always shown — these are the host's own listings) */}
                <div className="listing-actions">
                  <button onClick={() => navigate(`/update/${listing._id}`)}>
                    Update
                  </button>
                  <button onClick={() => handleDelete(listing._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewListings;
