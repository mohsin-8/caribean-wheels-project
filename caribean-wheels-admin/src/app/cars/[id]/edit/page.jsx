"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import carApi from "@/lib/carApi";
import Swal from "sweetalert2";

/**
 * IMPORTANT:
 * These are the ONLY fields we send to backend
 * to avoid Mongo cast errors.
 */
const ALLOWED_FIELDS = [
  "title",
  "make",
  "model",
  "type",
  "year",
  "condition",
  "transmission",
  "fuelType",
  "regularPrice",
  "salePrice",
  "priceLabel",
  "vinNumber",
  "stockNumber",
  "mileage",
  "color",
  "description",
  "address",
  "latitude",
  "longitude",
];

export default function EditCarPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [form, setForm] = useState({});
  const [existingImages, setExistingImages] = useState([]); // [{url, publicId}]
  const [newImages, setNewImages] = useState([]);           // File[]
  const [vinReport, setVinReport] = useState(null);
  const [vinUrl, setVinUrl] = useState(null);

  /* ================= FETCH CAR ================= */
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await carApi.get(`/${id}`);
        const car = data.car;

        // Pick ONLY allowed fields
        const cleanForm = {};
        ALLOWED_FIELDS.forEach((field) => {
          cleanForm[field] = car[field] ?? "";
        });

        setForm(cleanForm);
        setExistingImages(car.images || []);
        setVinUrl(car.vinReport?.url || null);
      } catch (error) {
        Swal.fire("Error", "Unable to load car data", "error");
        router.push("/cars");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCar();
  }, [id, router]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVinChange = (e) => {
    setVinReport(e.target.files[0]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Send safe fields only
      ALLOWED_FIELDS.forEach((field) => {
        if (form[field] !== undefined) {
          formData.append(field, form[field]);
        }
      });

      /**
       * IMPORTANT:
       * We send remaining existing images
       * so backend can rebuild images array
       */
      existingImages.forEach((img) => {
        formData.append("existingImages[]", JSON.stringify(img));
      });

      // New images
      newImages.forEach((file) => {
        formData.append("images", file);
      });

      // Replace VIN PDF (optional)
      if (vinReport instanceof File) {
        formData.append("vinReport", vinReport);
      }

      await carApi.put(`/${id}`, formData);

      await Swal.fire({
        icon: "success",
        title: "Car Updated",
        text: "Car updated successfully",
      });

      router.push("/cars");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="text-center py-5">Loading car details...</div>
      </Layout>
    );
  }

  /* ================= UI ================= */
  return (
    <Layout>
      <div className="container-fluid py-4">
        <h3 className="fw-bold text-secondary mb-4">Edit Car</h3>

        <form onSubmit={handleSubmit} className="card p-4 admin-card">
          <div className="row g-3">

            {/* ===== TEXT FIELDS ===== */}
            {ALLOWED_FIELDS.map((field) => (
              <div key={field} className="col-md-4">
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                />
              </div>
            ))}

            {/* ===== EXISTING IMAGES ===== */}
            <div className="col-12">
              <label className="fw-semibold">Car Images</label>

              {existingImages.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {existingImages.map((img, index) => (
                    <div
                      key={img.publicId}
                      className="position-relative border rounded"
                      style={{ width: 110, height: 110 }}
                    >
                      <img
                        src={img.url}
                        alt="car"
                        className="w-100 h-100 rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
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

            {/* ===== ADD NEW IMAGES ===== */}
            <div className="col-md-6">
              <label className="fw-semibold">Add New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className="form-control"
              />

              {newImages.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {newImages.map((file, index) => (
                    <div
                      key={index}
                      className="position-relative border rounded"
                      style={{ width: 110, height: 110 }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-100 h-100 rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
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

            {/* ===== VIN REPORT ===== */}
            <div className="col-md-6">
              <label className="fw-semibold">VIN Report (PDF)</label>

              {vinUrl && (
                <div className="mb-2">
                  <a
                    href={vinUrl}
                    target="_blank"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    View Existing VIN Report
                  </a>
                </div>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleVinChange}
                className="form-control"
              />
            </div>

          </div>

          <div className="mt-4 text-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Car"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};