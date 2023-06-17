import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { User, ColorTag, CollectionTag } from "../../data";

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
  for (let User of data) {
    promises.push(fnUser(User));
  }
  await Promise.all(promises);
  return res.json("Done");
});
const insertColorTag = asyncHandler(async (req, res) => {
  const promises = [];
  for (let ColorTag of data) {
    promises.push(fnColorTag(ColorTag));
  }
  await Promise.all(promises);
  return res.json("Done");
});
const insertCollectionTag = asyncHandler(async (req, res) => {
  const promises = [];
  for (let CollectionTag of data) {
    promises.push(fnCollectionTag(CollectionTag));
  }
  await Promise.all(promises);
  return res.json("Done");
});

export { insertUser, insertColorTag, insertCollectionTag };
