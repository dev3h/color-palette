const user = require("./user");
const colorTag = require("./color_tag");
const collectionTag = require("./collection_tag");
const palette = require("./palette");
const insertData = require("./insert_data");

module.exports = {
  ...user,
  ...colorTag,
  ...collectionTag,
  ...palette,
  ...insertData,
};
