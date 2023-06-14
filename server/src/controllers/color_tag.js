import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { ColorTag } from "../models";

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
  const colorTags = await ColorTag.find();
  return res.status(200).json({
    success: colorTags ? true : false,
    colorTags: colorTags ? colorTags : "",
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

export { createColorTag, getColorTags, getColorTag, updateColorTag, deleteColorTag };
