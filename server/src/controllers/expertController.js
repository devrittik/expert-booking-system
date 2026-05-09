const Expert = require("../models/Expert");
const ApiError = require("../utils/ApiError");

exports.getExperts = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 24);
        const category = req.query.category || "";
        const search = req.query.search || "";

        const query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$text = { $search: search };
        }

        const [experts, total] = await Promise.all([
            Expert.find(query)
                .select("-slots")
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Expert.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: experts,
            pagination: {
                total,
                page,
                pages: Math.max(Math.ceil(total / limit), 1),
                limit,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getExpertById = async (req, res, next) => {
    try {
        const expert = await Expert.findById(req.params.id).lean();

        if (!expert) {
            throw new ApiError("Expert not found", 404);
        }

        res.json({ success: true, data: expert });
    } catch (err) {
        next(err);
    }
};
