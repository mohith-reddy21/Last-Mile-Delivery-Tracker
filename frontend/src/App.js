import React, { useState } from "react";
import "./App.css";

function App() {

    // =========================
    // LOGIN
    // =========================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    const [page, setPage] = useState("dashboard");
    const [message, setMessage] = useState("");

    // =========================
    // CREATE DELIVERY
    // =========================

    const [pickupAddress, setPickupAddress] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [packageDetails, setPackageDetails] = useState("");

    // =========================
    // MY DELIVERIES
    // =========================

    const [deliveries, setDeliveries] = useState([]);
    const [loadingDeliveries, setLoadingDeliveries] = useState(false);
    const [deliveryError, setDeliveryError] = useState("");

    // =========================
    // SELECTED DELIVERY
    // =========================

    const [selectedDelivery, setSelectedDelivery] = useState(null);

    // =========================
    // STATUS LIST
    // =========================

    const statuses = [
        "Pending",
        "Accepted",
        "Picked Up",
        "Out for Delivery",
        "Delivered"
    ];

    // =========================
    // LOGIN
    // =========================

    const login = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "https://last-mile-delivery-tracker-9ggm.onrender.com/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setMessage(
                    data.message ||
                    data.error ||
                    "Login failed"
                );

                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setUser(data.user);
            setLoggedIn(true);
            setMessage("");

        } catch (error) {

            setMessage(
                "Cannot connect to server"
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setLoggedIn(false);
        setUser(null);
        setPage("dashboard");
        setSelectedDelivery(null);
    };

    // =========================
    // CREATE DELIVERY
    // =========================

    const createDelivery = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "https://last-mile-delivery-tracker-9ggm.onrender.com/api/deliveries",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        pickupAddress,
                        deliveryAddress,
                        packageDetails
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                setMessage(
                    data.message ||
                    data.error ||
                    "Failed to create delivery"
                );

                return;
            }

            setMessage(
                "Delivery created successfully!"
            );

            setPickupAddress("");
            setDeliveryAddress("");
            setPackageDetails("");

        } catch (error) {

            setMessage(
                "Cannot connect to server"
            );
        }
    };

    // =========================
    // GET MY DELIVERIES
    // =========================

    const getMyDeliveries = async () => {

        setLoadingDeliveries(true);
        setDeliveryError("");

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "https://last-mile-delivery-tracker-9ggm.onrender.com/api/deliveries/my",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                setDeliveryError(
                    data.message ||
                    data.error ||
                    "Failed to load deliveries"
                );

                return;
            }

            setDeliveries(
                data.deliveries || []
            );

        } catch (error) {

            setDeliveryError(
                "Cannot connect to server"
            );

        } finally {

            setLoadingDeliveries(false);
        }
    };

    // =========================
    // OPEN DELIVERIES
    // =========================

    const openDeliveries = () => {

        setPage("deliveries");

        getMyDeliveries();
    };

    // =========================
    // TRACK DELIVERY
    // =========================

    const trackDelivery = (delivery) => {

        setSelectedDelivery(delivery);

        setPage("track");
    };

    // =========================
    // UPDATE DELIVERY STATUS
    // =========================

    const updateStatus = async (action) => {

        if (!selectedDelivery) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `https://last-mile-delivery-tracker-9ggm.onrender.com/api/deliveries/${selectedDelivery._id}/${action}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                setMessage(
                    data.message ||
                    data.error ||
                    "Failed to update status"
                );

                return;
            }

            // Update selected delivery
            setSelectedDelivery(
                data.delivery
            );

            // Update delivery inside list
            setDeliveries((oldDeliveries) =>
                oldDeliveries.map((delivery) =>
                    delivery._id === data.delivery._id
                        ? data.delivery
                        : delivery
                )
            );

            setMessage(
                data.message ||
                "Delivery status updated successfully"
            );

        } catch (error) {

            setMessage(
                "Cannot connect to server"
            );
        }
    };

    // =========================
    // GET CURRENT STATUS INDEX
    // =========================

    const getStatusIndex = () => {

        if (!selectedDelivery) {
            return -1;
        }

        return statuses.indexOf(
            selectedDelivery.status
        );
    };

    // =========================
    // LOGIN SCREEN
    // =========================

    if (!loggedIn) {

        return (

            <div className="app">

                <div className="login-card">

                    <h1>
                        Last-Mile Delivery
                    </h1>

                    <p className="subtitle">
                        Delivery Tracking System
                    </p>

                    <form onSubmit={login}>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                    </form>

                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}

                </div>

            </div>
        );
    }

    // =========================
    // MAIN APPLICATION
    // =========================

    return (

        <div className="dashboard">

            {/* NAVBAR */}

            <nav className="navbar">

                <div className="logo">
                    Last-Mile Delivery
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </nav>

            <div className="dashboard-content">

                {/* =========================
                    DASHBOARD
                ========================= */}

                {page === "dashboard" && (

                    <>
                        <h1>
                            Dashboard
                        </h1>

                        <div className="welcome-card">

                            <h2>
                                Welcome
                                {user?.name
                                    ? `, ${user.name}`
                                    : "!"}
                            </h2>

                            <p>
                                Manage your deliveries
                                from one place.
                            </p>

                            <div className="user-info">

                                <div>

                                    <strong>
                                        Email
                                    </strong>

                                    <span>
                                        {user?.email}
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Role
                                    </strong>

                                    <span>
                                        {user?.role}
                                    </span>

                                </div>

                            </div>

                        </div>
                        

                        <div className="cards">

                            {/* DELIVERIES */}

                            <div className="dashboard-card">

                                <h3>
                                    📦 Deliveries
                                </h3>

                                <p>
                                    View and manage your
                                    deliveries.
                                </p>

                                <button
                                    onClick={
                                        openDeliveries
                                    }
                                >
                                    My Deliveries
                                </button>

                            </div>

                            {/* TRACK */}

                            <div className="dashboard-card">

                                <h3>
                                    🚚 Track Delivery
                                </h3>

                                <p>
                                    Check the current
                                    status of your package.
                                </p>

                                <button
                                    onClick={
                                        openDeliveries
                                    }
                                >
                                    Track Delivery
                                </button>

                            </div>

                            {/* CREATE */}

                            <div className="dashboard-card">

                                <h3>
                                    ➕ Create Delivery
                                </h3>

                                <p>
                                    Create a new delivery
                                    request.
                                </p>

                                <button
                                    onClick={() => {

                                        setPage("create");

                                        setMessage("");

                                    }}
                                >
                                    Create Delivery
                                </button>

                            </div>

                        </div>
                    </>
                )}

                {/* =========================
                    CREATE DELIVERY
                ========================= */}

                {page === "create" && (

                    <div className="page-card">

                        <button
                            className="back-btn"
                            onClick={() => {

                                setPage("dashboard");

                                setMessage("");

                            }}
                        >
                            ← Back
                        </button>

                        <h1>
                            Create Delivery
                        </h1>

                        <p>
                            Enter the delivery details.
                        </p>

                        <form
                            className="delivery-form"
                            onSubmit={createDelivery}
                        >

                            <label>
                                Pickup Address
                            </label>

                            <input
                                type="text"
                                placeholder="Example: VIT University, Vellore"
                                value={pickupAddress}
                                onChange={(e) =>
                                    setPickupAddress(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <label>
                                Delivery Address
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Chennai Central"
                                value={deliveryAddress}
                                onChange={(e) =>
                                    setDeliveryAddress(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <label>
                                Package Details
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Documents"
                                value={packageDetails}
                                onChange={(e) =>
                                    setPackageDetails(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <button type="submit">
                                Create Delivery
                            </button>

                        </form>

                        {message && (

                            <p className="success-message">
                                {message}
                            </p>

                        )}

                    </div>
                )}

                {/* =========================
                    MY DELIVERIES
                ========================= */}

                {page === "deliveries" && (

                    <div className="page-card">

                        <button
                            className="back-btn"
                            onClick={() =>
                                setPage("dashboard")
                            }
                        >
                            ← Back
                        </button>

                        <h1>
                            My Deliveries
                        </h1>

                        <p>
                            View and manage your deliveries.
                        </p>

                        {loadingDeliveries && (

                            <p className="message">
                                Loading deliveries...
                            </p>

                        )}

                        {deliveryError && (

                            <p className="error-message">
                                {deliveryError}
                            </p>

                        )}

                        {!loadingDeliveries &&
                            !deliveryError &&
                            deliveries.length === 0 && (

                                <p className="message">
                                    No deliveries found.
                                </p>

                            )}

                        <div className="delivery-list">

                            {deliveries.map(
                                (delivery) => (

                                    <div
                                        className="delivery-card"
                                        key={delivery._id}
                                    >

                                        <div className="delivery-header">

                                            <h2>
                                                📦 Delivery
                                            </h2>

                                            <span
                                                className={`status ${delivery.status
                                                    ?.toLowerCase()
                                                    .replaceAll(
                                                        " ",
                                                        "-"
                                                    )}`}
                                            >
                                                {delivery.status}
                                            </span>

                                        </div>

                                        <div className="delivery-details">

                                            <div>

                                                <strong>
                                                    Pickup Address
                                                </strong>

                                                <p>
                                                    {
                                                        delivery.pickupAddress
                                                    }
                                                </p>

                                            </div>

                                            <div>

                                                <strong>
                                                    Delivery Address
                                                </strong>

                                                <p>
                                                    {
                                                        delivery.deliveryAddress
                                                    }
                                                </p>

                                            </div>

                                            <div>

                                                <strong>
                                                    Package Details
                                                </strong>

                                                <p>
                                                    {
                                                        delivery.packageDetails
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            onClick={() =>
                                                trackDelivery(
                                                    delivery
                                                )
                                            }
                                        >
                                            Track Delivery
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    </div>
                )}

                {/* =========================
                    TRACK DELIVERY
                ========================= */}

                {page === "track" && (

                    <div className="page-card">

                        <button
                            className="back-btn"
                            onClick={() =>
                                setPage("deliveries")
                            }
                        >
                            ← Back
                        </button>

                        <h1>
                            Track Delivery
                        </h1>

                        <p>
                            Track and manage your package.
                        </p>

                        {!selectedDelivery ? (

                            <div className="delivery-card">

                                <h2>
                                    📦 No Delivery Selected
                                </h2>

                                <p>
                                    Select a delivery
                                    from My Deliveries.
                                </p>

                                <button
                                    onClick={
                                        openDeliveries
                                    }
                                >
                                    View My Deliveries
                                </button>

                            </div>

                        ) : (

                            <div className="delivery-card">

                                {/* HEADER */}

                                <div className="delivery-header">

                                    <h2>
                                        📦 Delivery
                                    </h2>

                                    <span
                                        className={`status ${selectedDelivery.status
                                            ?.toLowerCase()
                                            .replaceAll(
                                                " ",
                                                "-"
                                            )}`}
                                    >
                                        {
                                            selectedDelivery.status
                                        }
                                    </span>

                                </div>

                                {/* DETAILS */}

                                <div className="delivery-details">

                                    <div>

                                        <strong>
                                            Pickup Address
                                        </strong>

                                        <p>
                                            {
                                                selectedDelivery.pickupAddress
                                            }
                                        </p>

                                    </div>

                                    <div>

                                        <strong>
                                            Delivery Address
                                        </strong>

                                        <p>
                                            {
                                                selectedDelivery.deliveryAddress
                                            }
                                        </p>

                                    </div>

                                    <div>

                                        <strong>
                                            Package Details
                                        </strong>

                                        <p>
                                            {
                                                selectedDelivery.packageDetails
                                            }
                                        </p>

                                    </div>

                                </div>

                                {/* PROGRESS */}

                                <h2 className="progress-title">
                                    Delivery Progress
                                </h2>

                                <div className="progress-container">

                                    {statuses.map(
                                        (status, index) => {

                                            const currentIndex =
                                                getStatusIndex();

                                            const completed =
                                                index <=
                                                currentIndex;

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
                                        }
                                    )}

                                </div>

                                {/* CURRENT STATUS */}

                                <div className="tracking-info">

                                    <p>

                                        <strong>
                                            Current Status:
                                        </strong>{" "}

                                        {
                                            selectedDelivery.status
                                        }

                                    </p>

                                    {selectedDelivery.updatedAt && (

                                        <p>

                                            <strong>
                                                Last Updated:
                                            </strong>{" "}

                                            {new Date(
                                                selectedDelivery.updatedAt
                                            ).toLocaleString()}

                                        </p>

                                    )}

                                </div>

                                {/* =========================
                                    STATUS UPDATE BUTTONS
                                ========================= */}

                                <div className="status-actions">

                                    {selectedDelivery.status ===
                                        "Pending" && (

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    "accept"
                                                )
                                            }
                                        >
                                            Accept Delivery
                                        </button>

                                    )}

                                    {selectedDelivery.status ===
                                        "Accepted" && (

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    "pickup"
                                                )
                                            }
                                        >
                                            Pick Up Delivery
                                        </button>

                                    )}

                                    {selectedDelivery.status ===
                                        "Picked Up" && (

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    "out-for-delivery"
                                                )
                                            }
                                        >
                                            Start Delivery
                                        </button>

                                    )}

                                    {selectedDelivery.status ===
                                        "Out for Delivery" && (

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    "delivered"
                                                )
                                            }
                                        >
                                            Mark as Delivered
                                        </button>

                                    )}

                                    {selectedDelivery.status ===
                                        "Delivered" && (

                                        <div className="success-message">

                                            ✅ Delivery completed
                                            successfully!

                                        </div>

                                    )}

                                </div>

                                {message && (

                                    <p className="success-message">
                                        {message}
                                    </p>

                                )}

                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default App;
