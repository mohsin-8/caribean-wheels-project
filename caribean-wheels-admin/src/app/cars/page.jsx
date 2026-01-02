"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import carApi from "@/lib/carApi";
import Swal from "sweetalert2";
import Layout from "@/components/Layout";

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [filters, setFilters] = useState({
        make: "",
        model: "",
        type: "",
        condition: "",
        year: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
    });

    const loadCars = async (targetPage = page) => {
        try {
            setLoading(true);

            const { data } = await carApi.get("/", {
                params: {
                    ...filters,
                    page: targetPage,
                },
            });

            setCars(data.cars || []);
            setPage(data.page || 1);
            setPages(data.pages || 1);
        } catch (error) {
            console.error("Failed to load cars", error);
            setCars([]);
            setPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCars(page);
    }, [page]);

    const applyFilters = () => {
        setPage(1);
        loadCars(1);
    };

    const handleDelete = async (carId, carTitle) => {
        const result = await Swal.fire({
            title: `Delete "${carTitle}"?`,
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await carApi.delete(`/${carId}`);
            setCars(cars.filter((car) => car._id !== carId));
            Swal.fire("Deleted!", `"${carTitle}" has been deleted.`, "success");
        } catch (error) {
            console.error("Failed to delete car", error);
            Swal.fire("Error", "Failed to delete car. Please try again.", "error");
        }
    };

    return (
        <Layout>
            <div className="container-fluid py-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <h3 className="fw-bold text-secondary mb-0">Car Management</h3>
                    <Link href="/cars/add-car" className="btn btn-primary">
                        + Add Car
                    </Link>
                </div>

                <div className="card admin-card mb-4 p-3">
                    <div className="row g-3">
                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Make"
                                value={filters.make}
                                onChange={(e) =>
                                    setFilters({ ...filters, make: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Model"
                                value={filters.model}
                                onChange={(e) =>
                                    setFilters({ ...filters, model: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Type"
                                value={filters.type}
                                onChange={(e) =>
                                    setFilters({ ...filters, type: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters.condition}
                                onChange={(e) =>
                                    setFilters({ ...filters, condition: e.target.value })
                                }
                            >
                                <option value="">Condition</option>
                                <option value="new">New</option>
                                <option value="used">Used</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters({ ...filters, minPrice: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters({ ...filters, maxPrice: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filters.sortBy}
                                onChange={(e) =>
                                    setFilters({ ...filters, sortBy: e.target.value })
                                }
                            >
                                <option value="">Sort By</option>
                                <option value="price_asc">Price ↑</option>
                                <option value="price_desc">Price ↓</option>
                                <option value="year_desc">Year ↓</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <button
                                onClick={applyFilters}
                                className="btn btn-secondary w-100"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card admin-card p-3">

                    {loading ? (
                        <div className="text-center py-5 fw-semibold">
                            Loading cars...
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="text-center py-5">
                            <h5 className="text-secondary fw-semibold">
                                No cars available
                            </h5>
                            <p className="text-muted mb-0">
                                Try adjusting filters or add a new car.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Make</th>
                                            <th>Year</th>
                                            <th>Price</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cars.map((car) => (
                                            <tr key={car._id}>
                                                <td data-label="Image">
                                                    {car.images?.[0] ? (
                                                        <img
                                                            src={car.images[0].url}
                                                            alt={car.title}
                                                            className="car-thumb"
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td data-label="Title">{car.title}</td>
                                                <td data-label="Make">{car.make}</td>
                                                <td data-label="Year">{car.year}</td>
                                                <td data-label="Price">
                                                    ${car.regularPrice}
                                                </td>

                                                <td
                                                    data-label="Actions"
                                                    className="text-end"
                                                >
                                                    {car.vinReport && <Link
                                                        href={car.vinReport.url}
                                                        target="_blank"
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                    >
                                                        View vin report
                                                    </Link>}

                                                    <Link
                                                        href={`/cars/${car._id}/edit`}
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        className="ms-2 btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(car._id, car.title)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            <nav className="mt-4">
                                <ul className="pagination justify-content-end mb-0">
                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {[...Array(pages)].map((_, i) => (
                                        <li
                                            key={i}
                                            className={`page-item ${page === i + 1 ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li
                                        className={`page-item ${page === pages ? "disabled" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};