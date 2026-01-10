const { nanoid } = require("nanoid");

const generateFileCode = () => {
  return nanoid(6);
};

module.exports = { generateFileCode };
