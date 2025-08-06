/**
 * Centralized error handling
 */

const errorHandler = (err, req, res) => {
  console.error("Error:", err);

  // Default error
  let error = {
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
  };

  if (err.name === "SequelizeValidationError") {
    error.statusCode = 400;
    error.message = "Validation Error";
    error.errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    error.statusCode = 400;
    error.message = "Duplicate entry";
    error.errors = err.errors.map((e) => ({
      message: `${e.path} already exists`,
    }));
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    error.statusCode = 400;
    error.message = "Referenced record does not exist";
  }

  const response = {
    success: false,
    message: error.message,
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
