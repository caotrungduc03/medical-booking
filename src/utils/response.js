const response = (code, message, data = []) => {
  return {
    code,
    message,
    data,
  };
};

module.exports = response;
