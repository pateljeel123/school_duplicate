const supabaseModel = require("../Models/supabaseModel");

module.exports.GETDOCTORS = async (req, res) => {
    const { specialization } = req.query;
    try {
        const { data, error } = await supabaseModel.getDoctors(specialization);

        if (error) {
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        return res.status(200).json({ doctorsData: data });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports.UpdateDoctors = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        return res.status(400).json({ message: "Please provide an ID!!" });
    }

    try {
        const { data, error } = await supabaseModel.updateDoctor(id, updateData);

        if (error) {
            return res.status(500).json({ message: "Database error", error: error.message });
        }
        return res.status(200).json({ message: "Doctor updated successfully", updatedData: data });
    } catch (error) {
        return res.status(400).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.DeleteDoctors = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Doctor ID required!" });
    }

    try {
        const { error } = await supabaseModel.deleteDoctor(id);

        if (error) {
            return res.status(500).json({
                message: "Error deleting doctor",
                error: error.message
            });
        }

        // Success case
        return res.status(200).json({
            message: "Doctor deleted successfully from both DB and Auth!"
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

module.exports.GET_HODS = async (req, res) => {
    const { department } = req.query;
    try {
        const { data, error } = await supabaseModel.getHODs(department);

        if (error) {
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        return res.status(200).json({ hodsData: data });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.UPDATE_HOD = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        return res.status(400).json({ message: "Please provide a HOD ID!" });
    }

    try {
        const { data, error } = await supabaseModel.updateHOD(id, updateData);

        if (error) {
            if (error.message === "HOD not found with this ID") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        return res.status(200).json({
            message: "HOD updated successfully",
            updatedHod: data
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.DELETE_HOD = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Please provide a HOD ID to delete!" });
    }

    try {
        const { error } = await supabaseModel.deleteHOD(id);

        if (error) {
            if (error.message === "HOD not found with this ID") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        return res.status(200).json({ message: "HOD deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};