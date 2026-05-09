const { validationResult } = require("express-validator");

const validate = (rules) => async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map(({ path, msg, value }) => ({
                field: path,
                message: msg,
                value,
            })),
        });
    }
    next();
};

module.exports = validate;
