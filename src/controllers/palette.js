const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { Palette } = require("../models");

const createPalette = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.colors)
    req.body.slug = slugify(req.body.colors, { lower: true });

  const newPalette = await Palette.create(req.body);

  return res.status(201).json({
    success: newPalette ? true : false,
    data: newPalette ? newPalette : "cannot create palette",
  });
});

const getPalettes = asyncHandler(async (req, res) => {
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
  let queryCommand = Palette.find(formattedQueries); // pending

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
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // Execute query
  const populateQuery = queryCommand.populate([
    { path: "tags.colorTags", select: "name hex" },
    { path: "tags.collectionTags", select: "name" },
    { path: "likes", select: "displayname email" },
  ]);
  const response = await queryCommand.exec();
  // số lượng thỏa mãn điều kiện
  const counts = await Palette.find(formattedQueries).countDocuments();
  return res.status(200).json({
    success: response ? true : false,
    counts,
    data: response ? response : "cannot get palettes",
  });
});

const getPalette = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing inputs");
  const palette = await Palette.findById(id);
  return res.status(200).json({
    success: palette ? true : false,
    data: palette ? palette : "cannot get palette",
  });
});
const updatePalette = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (req.body && req.body.colors)
    req.body.slug = slugify(req.body.colors, { lower: true });

  const response = await Palette.findByIdAndUpdate(id, req.body, { new: true });

  // const palette = await Palette.findById(id);
  // const { colorTags, collectionTags } = palette.tags;
  // if (colorTags.length > 0) {
  //   req.body.tags.colorTags = [...colorTags, ...req.body.tags.colorTags];
  // }
  // if (collectionTags.length > 0) {
  //   req.body.tags.collectionTags = [...collectionTags, ...req.body.tags.collectionTags];
  // }

  return res.status(200).json({
    success: response ? true : false,
    updated: response ? response : "update palette failed",
  });
});
const deletePalette = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id, typeof id);
  if (!id) throw new Error("Missing inputs");
  const response = await Palette.findByIdAndDelete(id);
  return res.status(200).json({
    success: response ? true : false,
    deleted: response ? response : "delete palette failed",
  });
});

const toggleLiked = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { pid } = req.params;
  if (!pid) throw new Error("Missing inputs");
  const alreadyLiked = await Palette.findOne({ _id: pid, likes: { $in: [_id] } });
  if (!alreadyLiked) {
    const response = await Palette.findByIdAndUpdate(
      pid,
      { $push: { likes: _id }, $inc: { total_like: 1 } },

      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      liked: response ? response : "like failed",
    });
  } else {
    const response = await Palette.findByIdAndUpdate(
      pid,
      { $pull: { likes: _id }, $inc: { total_like: -1 } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      liked: response ? response : "unlike failed",
    });
  }
});

module.exports = {
  createPalette,
  getPalettes,
  getPalette,
  updatePalette,
  deletePalette,
  toggleLiked,
};
