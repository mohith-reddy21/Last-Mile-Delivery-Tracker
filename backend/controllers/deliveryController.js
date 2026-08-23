const Delivery = require("../models/delivery");

// ==========================================
// 1. Create a delivery
// ==========================================
const createDelivery = async (req, res) => {
    try {
        const {
            pickupAddress,
            deliveryAddress,
            packageDetails
        } = req.body;

        const delivery = await Delivery.create({
            customer: req.user.id,
            pickupAddress,
            deliveryAddress,
            packageDetails,
            status: "Pending"
        });

        res.status(201).json({
            message: "Delivery created successfully",
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// 2. Get customer's deliveries
// ==========================================
const getMyDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({
            customer: req.user.id
        })
        .populate("customer", "name email phone")
        .populate("agent", "name email phone");

        res.status(200).json({
            deliveries
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// 3. Get one delivery by ID
// ==========================================
const getDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
            .populate("customer", "name email phone")
            .populate("agent", "name email phone");

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        res.status(200).json({
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// 4. Agent accepts a delivery
// Pending → Accepted
// ==========================================
const acceptDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        // Only agents can accept deliveries
        if (req.user.role !== "agent") {
            return res.status(403).json({
                message: "Only agents can accept deliveries"
            });
        }

        // Delivery must be Pending
        if (delivery.status !== "Pending") {
            return res.status(400).json({
                message: "Delivery is not available"
            });
        }

        // Assign agent
        delivery.agent = req.user.id;

        // Change status
        delivery.status = "Accepted";

        await delivery.save();

        res.status(200).json({
            message: "Delivery accepted successfully",
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// 5. Agent picks up the package
// Accepted → Picked Up
// ==========================================
const pickupDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        // Only agents can pick up deliveries
        if (req.user.role !== "agent") {
            return res.status(403).json({
                message: "Only agents can pick up deliveries"
            });
        }

        // Check that this agent is assigned
        if (
            !delivery.agent ||
            delivery.agent.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not assigned to this delivery"
            });
        }

        // Delivery must be Accepted
        if (delivery.status !== "Accepted") {
            return res.status(400).json({
                message: "Delivery must be accepted first"
            });
        }

        delivery.status = "Picked Up";

        await delivery.save();

        res.status(200).json({
            message: "Delivery picked up successfully",
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// 6. Package is out for delivery
// Picked Up → Out for Delivery
// ==========================================
const outForDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        // Only agents can update delivery
        if (req.user.role !== "agent") {
            return res.status(403).json({
                message: "Only agents can update deliveries"
            });
        }

        // Check that this agent is assigned
        if (
            !delivery.agent ||
            delivery.agent.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not assigned to this delivery"
            });
        }

        // Delivery must be Picked Up
        if (delivery.status !== "Picked Up") {
            return res.status(400).json({
                message: "Delivery must be picked up first"
            });
        }

        delivery.status = "Out for Delivery";

        await delivery.save();

        res.status(200).json({
            message: "Delivery is out for delivery",
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// 7. Complete the delivery
// Out for Delivery → Delivered
// ==========================================
const completeDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        // Only agents can complete deliveries
        if (req.user.role !== "agent") {
            return res.status(403).json({
                message: "Only agents can complete deliveries"
            });
        }

        // Check that this agent is assigned
        if (
            !delivery.agent ||
            delivery.agent.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not assigned to this delivery"
            });
        }

        // Delivery must be Out for Delivery
        if (delivery.status !== "Out for Delivery") {
            return res.status(400).json({
                message: "Delivery must be out for delivery first"
            });
        }

        delivery.status = "Delivered";

        await delivery.save();

        res.status(200).json({
            message: "Delivery completed successfully",
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// Export all functions
// ==========================================
module.exports = {
    createDelivery,
    getMyDeliveries,
    getDelivery,
    acceptDelivery,
    pickupDelivery,
    outForDelivery,
    completeDelivery
};