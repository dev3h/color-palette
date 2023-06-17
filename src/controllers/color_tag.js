const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { ColorTag } = require("../models");

const createColorTag = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  const newColorTag = await ColorTag.create(req.body);
  return res.status(201).json({
    success: newColorTag ? true : false,
    createdColorTag: newColorTag ? newColorTag : "cannot create color tag",
  });
});

const getColorTags = asyncHandler(async (req, res) => {
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
  let queryCommand = ColorTag.find(formattedQueries); // pending

  // Sorting
  if (req.query.sort) {
    // cho phép sort theo nhiều trường
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy); // sort('name hex')
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
  const counts = await ColorTag.find(formattedQueries).countDocuments();
  return res.status(200).json({
    success: response ? true : false,
    counts,
    colorTags: response ? response : "cannot get color tags",
  });
});

const getColorTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing inputs");
  const colorTag = await ColorTag.findById(id);
  return res.status(200).json({
    success: colorTag ? true : false,
    colorTag: colorTag ? colorTag : "cannot get color tag",
  });
});
const updateColorTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body && req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  const response = await ColorTag.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updateColorTag: response ? response : "update color tag failed",
  });
});
const deleteColorTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id, typeof id);
  if (!id) throw new Error("Missing inputs");
  const response = await ColorTag.findByIdAndDelete(id);
  return res.status(200).json({
    success: response ? true : false,
    deleteColorTag: response ? response : "delete color tag failed",
  });
});

module.exports = {
  createColorTag,
  getColorTags,
  getColorTag,
  updateColorTag,
  deleteColorTag,
};
