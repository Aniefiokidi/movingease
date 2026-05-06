export const apiResponse = (res, status, success, data, message, error = null) => {
  const payload = { success, data, message };
  if (error) payload.error = error;
  return res.status(status).json(payload);
};
