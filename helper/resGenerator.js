const resGenerator = (res, status, apiStatus, message, data) => {
  res.status(status).send({
    apiStatus,
    message,
    data,
  });
};
module.exports = { resGenerator };
