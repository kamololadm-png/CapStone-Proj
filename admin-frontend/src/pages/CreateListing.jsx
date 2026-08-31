import "./CreateListing.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    images: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
    price: "",
    weeklyDiscount: "",
    cleaningFee: "",
    serviceFee: "",
    occupancyTaxes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { title, description, type, location, guests, bedrooms, bathrooms, price } = formData;
    if (!title || !description || !type || !location || !guests || !bedrooms || !bathrooms || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        images: formData.images
          ? formData.images.split(",").map((url) => url.trim())
          : [],
        amenities: formData.amenities
          ? formData.amenities.split(",").map((item) => item.trim())
          : [],
        guests: Number(formData.guests),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        price: Number(formData.price),
        weeklyDiscount: Number(formData.weeklyDiscount) || 0,
        cleaningFee: Number(formData.cleaningFee) || 0,
        serviceFee: Number(formData.serviceFee) || 0,
        occupancyTaxes: Number(formData.occupancyTaxes) || 0,
      };

      await api.post("/accommodations", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form className="listing-form" onSubmit={handleSubmit}>
        <h1>Create New Listing</h1>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="title">Title *</label>
        <input id="title" name="title" value={formData.title} onChange={handleChange} />

        <label htmlFor="description">Description *</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

        <label htmlFor="type">Type *</label>
        <input
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Entire apartment"
        />

        <label htmlFor="location">Location *</label>
        <input id="location" name="location" value={formData.location} onChange={handleChange} />

        <label htmlFor="guests">Guests *</label>
        <input id="guests" name="guests" type="number" min="1" value={formData.guests} onChange={handleChange} />

        <label htmlFor="bedrooms">Bedrooms *</label>
        <input id="bedrooms" name="bedrooms" type="number" min="0" value={formData.bedrooms} onChange={handleChange} />

        <label htmlFor="bathrooms">Bathrooms *</label>
        <input id="bathrooms" name="bathrooms" type="number" min="0" value={formData.bathrooms} onChange={handleChange} />

        <label htmlFor="price">Price per night (R) *</label>
        <input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} />

        <label htmlFor="amenities">Amenities (comma-separated)</label>
        <input
          id="amenities"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          placeholder="wifi, kitchen, free parking"
        />

        <label htmlFor="images">Image URLs (comma-separated)</label>
        <input
          id="images"
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="/images/photo1.jpg, /images/photo2.jpg"
        />

        <label htmlFor="weeklyDiscount">Weekly Discount (%)</label>
        <input id="weeklyDiscount" name="weeklyDiscount" type="number" min="0" value={formData.weeklyDiscount} onChange={handleChange} />

        <label htmlFor="cleaningFee">Cleaning Fee (R)</label>
        <input id="cleaningFee" name="cleaningFee" type="number" min="0" value={formData.cleaningFee} onChange={handleChange} />

        <label htmlFor="serviceFee">Service Fee (R)</label>
        <input id="serviceFee" name="serviceFee" type="number" min="0" value={formData.serviceFee} onChange={handleChange} />

        <label htmlFor="occupancyTaxes">Occupancy Taxes (R)</label>
        <input id="occupancyTaxes" name="occupancyTaxes" type="number" min="0" value={formData.occupancyTaxes} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;