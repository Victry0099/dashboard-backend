export const successResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
