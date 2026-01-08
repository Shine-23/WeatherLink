export const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;

  const message =
    status === 500 ? "Server error" : err.message || "Something went wrong";

  console.error("[ERROR]", err);

  res.status(status).json({ message });
};
