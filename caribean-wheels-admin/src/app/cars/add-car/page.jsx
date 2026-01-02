"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import carApi from "@/lib/carApi";
import Layout from "@/components/Layout";
import Swal from "sweetalert2";

export default function AddCarPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        make: "",
        model: "",
        type: "",
        year: "",
        condition: "new",
        transmission: "manual",
        driveType: "",
        engineSize: "",
        cylinders: "",
        fuelType: "petrol",
        doors: "",
        seats: "",
        color: "",
        mileage: "",
        regularPrice: "",
        salePrice: "",
        priceLabel: "fixed",
        stockNumber: "",
        vinNumber: "",
        comfortFeatures: [],
        entertainmentFeatures: [],
        safetyFeatures: [],
        windowsFeatures: [],
        seatsFeatures: [],
        description: "",
        address: "",
        latitude: "",
        longitude: "",
    });

    const [images, setImages] = useState([]);
    const [vinReport, setVinReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle multi-image selection
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle VIN report selection
    const handleVinChange = (e) => {
        setVinReport(e.target.files[0]);
    };

    // Handle checkbox features
    const handleFeatureChange = (category, feature) => {
        setForm((prev) => {
            const current = prev[category];
            if (current.includes(feature)) {
                return { ...prev, [category]: current.filter((f) => f !== feature) };
            } else {
                return { ...prev, [category]: [...current, feature] };
            }
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            for (const key in form) {
                if (Array.isArray(form[key])) {
                    form[key].forEach((val) => formData.append(`${key}[]`, val));
                } else {
                    formData.append(key, form[key]);
                }
            }

            images.forEach((file) => formData.append("images", file));
            if (vinReport instanceof File) {
                formData.append("vinReport", vinReport);
            }
            await carApi.post("/", formData);

            await Swal.fire({
                icon: "success",
                title: "Car Added!",
                text: "The car has been added successfully.",
                confirmButtonText: "OK",
            });

            router.push("/cars");

        } catch (error) {
            console.log("FULL ERROR:", error);

            let message = "Internal Server Error";

            if (error?.response?.data?.message) {
                message = error.response.data.message;
            } else if (Array.isArray(error?.response?.data?.errors)) {
                message = error.response.data.errors
                    .map((e) => e.msg)
                    .join(", ");
            } else if (error?.message) {
                message = error.message;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: message,
            });
        }

        finally {
            setLoading(false);
        }
    };


    return (
        <Layout>
            <div className="container-fluid py-4">
                <h3 className="fw-bold text-secondary mb-4">Add New Car</h3>

                <form onSubmit={handleSubmit} className="card p-4 admin-card">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                name="make"
                                value={form.make}
                                onChange={handleChange}
                                placeholder="Make"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                placeholder="Model"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                placeholder="Type"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="number"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                placeholder="Year"
                                className="form-control"
                                required
                                min={1900}
                            />
                        </div>

                        <div className="col-md-4">
                            <select
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="new">New</option>
                                <option value="used">Used</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <select
                                name="transmission"
                                value={form.transmission}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="manual">Manual</option>
                                <option value="automatic">Automatic</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <select
                                name="fuelType"
                                value={form.fuelType}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="electric">Electric</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <input
                                type="number"
                                name="regularPrice"
                                value={form.regularPrice}
                                onChange={handleChange}
                                placeholder="Regular Price"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="number"
                                name="salePrice"
                                value={form.salePrice}
                                onChange={handleChange}
                                placeholder="Sale Price (optional)"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-4">
                            <select
                                name="priceLabel"
                                value={form.priceLabel}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="fixed">Fixed</option>
                                <option value="negotiable">Negotiable</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                name="vinNumber"
                                value={form.vinNumber}
                                onChange={handleChange}
                                placeholder="VIN Number"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                name="stockNumber"
                                value={form.stockNumber}
                                onChange={handleChange}
                                placeholder="Stock Number"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                type="number"
                                name="mileage"
                                value={form.mileage}
                                onChange={handleChange}
                                placeholder="Mileage"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                                placeholder="Color"
                                className="form-control"
                            />
                        </div>

                        {/* Images Upload */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Upload Images</label>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImagesChange}
                                className="form-control"
                            />

                            {/* Image Preview */}
                            {images.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    {images.map((file, index) => (
                                        <div
                                            key={index}
                                            className="position-relative border rounded"
                                            style={{ width: 100, height: 100 }}
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-100 h-100 rounded"
                                                style={{ objectFit: "cover" }}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                style={{ padding: "2px 6px" }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* VIN Report */}
                        <div className="col-md-6">
                            <label className="form-label">VIN Report</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleVinChange}
                                className="form-control"
                            />
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="form-control"
                                rows={4}
                            />
                        </div>

                        {/* Location */}
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="number"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                                placeholder="Latitude"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="number"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                                placeholder="Longitude"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mt-4 text-end">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Adding Car..." : "Add Car"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};