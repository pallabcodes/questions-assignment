const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;

const passwordRegex =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

module.exports = {
  emailRegex,
  passwordRegex,
};
