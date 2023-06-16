import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { CollectionTag } from "../models";

const createCollectionTag = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  const newCollectionTag = await CollectionTag.create(req.body);
  return res.status(201).json({
    success: newCollectionTag ? true : false,
    createdCollectionTag: newCollectionTag
      ? newCollectionTag
      : "cannot create collection tag",
  });
});

const getCollectionTags = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // tách cách trường đặc biệt ra khỏi query
  const removeFields = ["fields", "sort", "page", "limit"];
  removeFields.forEach((field) => delete queries[field]);

  let queryStr = JSON.stringify(queries);
  // thêm dấu $ vào trước các toán tử so sánh (toán tử trong mongoDB là $gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  const formattedQueries = JSON.parse(queryStr);

  // Filtering
  if (queries?.name) formattedQueries.name = { $regex: queries.name, $options: "i" };
  // ko để await vì ta sẽ thêm điều kiện sort, select, pagination nên lúc này query vẫn chưa thực thi
  let queryCommand = CollectionTag.find(formattedQueries); // pending

  // Sorting
  if (req.query.sort) {
    // cho phép sort theo nhiều trường
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else {
    // - là sort theo chiều giảm dần
    queryCommand = queryCommand.sort("-createdAt");
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  } else {
    queryCommand = queryCommand.select("-__v");
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 2;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // Execute query
  const response = await queryCommand.exec();
  // số lượng thỏa mãn điều kiện
  const counts = await CollectionTag.find(formattedQueries).countDocuments();
  return res.status(200).json({
    success: response ? true : false,
    counts,
    collectionTags: response ? response : "cannot get collection tags",
  });
});

const getCollectionTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing inputs");
  const collectionTag = await CollectionTag.findById(id);
  return res.status(200).json({
    success: collectionTag ? true : false,
    collectionTag: collectionTag ? collectionTag : "cannot get collection tag",
  });
});
const updateCollectionTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body && req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  const response = await CollectionTag.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updateCollectionTag: response ? response : "update collection tag failed",
  });
});
const deleteCollectionTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id, typeof id);
  if (!id) throw new Error("Missing inputs");
  const response = await CollectionTag.findByIdAndDelete(id);
  return res.status(200).json({
    success: response ? true : false,
    deleteCollectionTag: response ? response : "delete collection tag failed",
  });
});

export {
  createCollectionTag,
  getCollectionTags,
  getCollectionTag,
  updateCollectionTag,
  deleteCollectionTag,
};
