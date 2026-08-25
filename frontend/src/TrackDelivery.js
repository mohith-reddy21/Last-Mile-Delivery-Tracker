import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";

function TrackDelivery() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const statuses = [
        "Pending",
        "Accepted",
        "Picked Up",
        "Out for Delivery",
        "Delivered"
    ];

    // Get delivery from backend
    const fetchDelivery = async () => {
        try {
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://last-mile-delivery-tracker-9ggm.onrender.com/api/deliveries/${id}`,
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
                    "Failed to get delivery"
                );
            }

            setDelivery(data.delivery);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDelivery();
    }, [id]);

    // Get current status position
    const getStatusIndex = () => {
        if (!delivery) {
            return -1;
        }

        return statuses.indexOf(delivery.status);
    };

    // Update delivery status
    const updateStatus = async (action) => {
        try {
            setUpdating(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/deliveries/${id}/${action}`,
                {
                    method: "PUT",
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
                    "Failed to update delivery"
                );
            }

            setDelivery(data.delivery);

            setMessage(
                data.message || "Delivery status updated successfully"
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Decide which button to show
    const getActionButton = () => {
        if (!delivery) {
            return null;
        }

        switch (delivery.status) {

            case "Pending":
                return (
                    <button
                        className="action-btn"
                        onClick={() => updateStatus("accept")}
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Accept Delivery"}
                    </button>
                );

            case "Accepted":
                return (
                    <button
                        className="action-btn"
                        onClick={() => updateStatus("pickup")}
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Pick Up Delivery"}
                    </button>
                );

            case "Picked Up":
                return (
                    <button
                        className="action-btn"
                        onClick={() => updateStatus("out-for-delivery")}
                        disabled={updating}
                    >
                        {updating
                            ? "Updating..."
                            : "Out for Delivery"}
                    </button>
                );

            case "Out for Delivery":
                return (
                    <button
                        className="action-btn"
                        onClick={() => updateStatus("delivered")}
                        disabled={updating}
                    >
                        {updating
                            ? "Updating..."
                            : "Mark as Delivered"}
                    </button>
                );

            case "Delivered":
                return (
                    <div className="completed-message">
                        ✓ Delivery completed successfully!
                    </div>
                );

            default:
                return null;
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="page-card">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h1>Track Delivery</h1>

                <p>Loading delivery details...</p>

            </div>
        );
    }

    // Error
    if (error && !delivery) {
        return (
            <div className="page-card">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h1>Track Delivery</h1>

                <p className="error-message">
                    {error}
                </p>

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

            <h1>Track Delivery</h1>

            <p>
                Track and manage your package.
            </p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            <div className="delivery-card">

                {/* HEADER */}

                <div className="delivery-header">

                    <h2>
                        📦 Delivery
                    </h2>

                    <span
                        className={`status ${
                            delivery.status
                                ?.toLowerCase()
                                .replaceAll(" ", "-")
                        }`}
                    >
                        {delivery.status}
                    </span>

                </div>

                {/* DELIVERY DETAILS */}

                <div className="delivery-details">

                    <div>
                        <strong>
                            Pickup Address
                        </strong>

                        <p>
                            {delivery.pickupAddress}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Delivery Address
                        </strong>

                        <p>
                            {delivery.deliveryAddress}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Package Details
                        </strong>

                        <p>
                            {delivery.packageDetails}
                        </p>
                    </div>

                </div>

                {/* PROGRESS */}

                <h2 className="progress-title">
                    Delivery Progress
                </h2>

                <div className="progress-container">

                    {statuses.map((status, index) => {

                        const completed =
                            index <= getStatusIndex();

                        return (
                            <div
                                className={`progress-step ${
                                    completed
                                        ? "completed"
                                        : ""
                                }`}
                                key={status}
                            >

                                <div className="progress-circle">
                                    {completed
                                        ? "✓"
                                        : index + 1}
                                </div>

                                <div className="progress-text">
                                    {status}
                                </div>

                            </div>
                        );

                    })}

                </div>

                {/* CURRENT STATUS */}

                <div className="tracking-info">

                    <p>
                        <strong>
                            Current Status:
                        </strong>{" "}
                        {delivery.status}
                    </p>

                    {delivery.updatedAt && (
                        <p>
                            <strong>
                                Last Updated:
                            </strong>{" "}
                            {new Date(
                                delivery.updatedAt
                            ).toLocaleString()}
                        </p>
                    )}

                </div>

                {/* ACTION BUTTON */}

                <div className="status-action">
                    {getActionButton()}
                </div>

            </div>

        </div>
    );
}

export default TrackDelivery;
