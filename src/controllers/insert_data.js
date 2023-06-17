const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { UserData, ColorTagData, CollectionTagData } = require("../../data");
const { User, ColorTag, CollectionTag } = require("../models");

const fnUser = async (data) => {
  await User.create(data);
};
const fnColorTag = async (data) => {
  const slug = slugify(data?.name, { lower: true });
  data.slug = slug;
  await ColorTag.create(data);
};
const fnCollectionTag = async (data) => {
  const slug = slugify(data?.name, { lower: true });
  data.slug = slug;
  await CollectionTag.create(data);
};

const insertUser = asyncHandler(async (req, res) => {
  const promises = [];
  for (let data of UserData) {
    promises.push(fnUser(data));
  }
  await Promise.all(promises);
  return res.json("Done");
});
const insertColorTag = asyncHandler(async (req, res) => {
  const promises = [];
  for (let data of ColorTagData) {
    promises.push(fnColorTag(data));
  }
  await Promise.all(promises);
  return res.json("Done");
});

const insertCollectionTag = asyncHandler(async (req, res) => {
  const promises = [];
  for (let data of CollectionTagData) {
    promises.push(fnCollectionTag(data));
  }
  await Promise.all(promises);
  return res.json("Done");
});

module.exports = { insertUser, insertColorTag, insertCollectionTag };
