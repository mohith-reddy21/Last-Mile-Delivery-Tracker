import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function MyDeliveries() {
    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/deliveries",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to fetch deliveries"
                );
            }

            setDeliveries(data.deliveries || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "";

        return status
            .toLowerCase()
            .replaceAll(" ", "-");
    };

    if (loading) {
        return (
            <div className="page-card">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h1>My Deliveries</h1>

                <p>Loading your deliveries...</p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="page-card">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h1>My Deliveries</h1>

                <p className="error-message">
                    {error}
                </p>

                <button
                    className="action-btn"
                    onClick={fetchDeliveries}
                >
                    Try Again
                </button>

            </div>
        );
    }

    return (
        <div className="page-card">

            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h1>My Deliveries</h1>

            <p>
                View and manage all your deliveries.
            </p>

            {deliveries.length === 0 ? (

                <div className="empty-deliveries">

                    <h2>
                        📦 No Deliveries Found
                    </h2>

                    <p>
                        You have not created any deliveries yet.
                    </p>

                    <button
                        className="action-btn"
                        onClick={() => navigate("/create-delivery")}
                    >
                        Create Delivery
                    </button>

                </div>

            ) : (

                <div className="deliveries-list">

                    {deliveries.map((delivery) => (

                        <div
                            className="delivery-list-card"
                            key={delivery._id}
                        >

                            <div className="delivery-list-header">

                                <h2>
                                    📦 Delivery
                                </h2>

                                <span
                                    className={`status ${getStatusClass(
                                        delivery.status
                                    )}`}
                                >
                                    {delivery.status}
                                </span>

                            </div>

                            <div className="delivery-list-details">

                                <div>
                                    <strong>
                                        Pickup
                                    </strong>

                                    <p>
                                        {delivery.pickupAddress}
                                    </p>
                                </div>

                                <div>
                                    <strong>
                                        Delivery
                                    </strong>

                                    <p>
                                        {delivery.deliveryAddress}
                                    </p>
                                </div>

                                <div>
                                    <strong>
                                        Package
                                    </strong>

                                    <p>
                                        {delivery.packageDetails}
                                    </p>
                                </div>

                            </div>

                            <div className="delivery-list-footer">

                                <span>
                                    Created:{" "}
                                    {delivery.createdAt
                                        ? new Date(
                                            delivery.createdAt
                                        ).toLocaleString()
                                        : "N/A"}
                                </span>

                                <button
                                    className="action-btn"
                                    onClick={() =>
                                        navigate(
                                            `/track/${delivery._id}`
                                        )
                                    }
                                >
                                    Track Delivery
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyDeliveries;