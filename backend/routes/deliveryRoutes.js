const express = require("express");

const {
    createDelivery,
    getMyDeliveries,
    getDelivery,
    acceptDelivery,
    pickupDelivery,
    outForDelivery,
    completeDelivery
} = require("../controllers/deliveryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// Customer creates a delivery
// POST /api/deliveries
// ==========================================
router.post("/", protect, createDelivery);


// ==========================================
// Customer gets their deliveries
// GET /api/deliveries/my
// ==========================================
router.get("/my", protect, getMyDeliveries);


// ==========================================
// Get one delivery
// GET /api/deliveries/:id
// ==========================================
router.get("/:id", protect, getDelivery);


// ==========================================
// Agent accepts delivery
// PUT /api/deliveries/:id/accept
// ==========================================
router.put("/:id/accept", protect, acceptDelivery);


// ==========================================
// Agent picks up delivery
// PUT /api/deliveries/:id/pickup
// ==========================================
router.put("/:id/pickup", protect, pickupDelivery);


// ==========================================
// Delivery goes out for delivery
// PUT /api/deliveries/:id/out-for-delivery
// ==========================================
router.put(
    "/:id/out-for-delivery",
    protect,
    outForDelivery
);


// ==========================================
// Delivery is completed
// PUT /api/deliveries/:id/delivered
// ==========================================
router.put(
    "/:id/delivered",
    protect,
    completeDelivery
);


module.exports = router;