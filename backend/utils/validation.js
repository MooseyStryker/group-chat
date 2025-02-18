const { validationResult } = require('express-validator');

// Reorders the error handling from express-validator middleware to JSON
const handleValidationErrors = (req, _res, next) => {
    const validationError = validationResult(req);

    if (!validationError.isEmpty()) {
        const errors = {};
        validationError.array().forEach(error => errors[error.path] = error.msg);


        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request";
        next(err);
    } else {
        next();
    }
};

module.exports = {
    handleValidationErrors
};
