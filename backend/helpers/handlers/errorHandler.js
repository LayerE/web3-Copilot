/* Error Handler */
export default function (statusCode, errorMessage, res) {
  if (statusCode === 400) {
    res.status(statusCode).send({
      message: errorMessage || "Bad Request",
    });
  } else if (statusCode === 401) {
    res.status(statusCode).send({
      message: errorMessage || "Unauthorized",
    });
  } else if (statusCode === 403) {
    res.status(statusCode).send({
      message: errorMessage || "Forbidden",
    });
  } else if (statusCode === 404) {
    res.status(statusCode).send({
      message: errorMessage || "Not Found",
    });
  } else if (statusCode === 500) {
    res.status(statusCode).send({
      message: errorMessage || "Internal Server Error",
    });
  } else {
    res.status(statusCode).send({
      message: errorMessage || "Something went wrong",
    });
  }
}
