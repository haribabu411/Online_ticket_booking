const mongoose = require("mongoose");
const User = require("../models/user");

const allowedFields = [
  "firstName",
  "lastName",
  "email",
  "jobtitle",
  "gender",
];

function validateFields(body, requiredAll = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object";
  }

  const unknownFields = Object.keys(body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (unknownFields.length > 0) {
    return `Unknown fields: ${unknownFields.join(", ")}`;
  }

  const fieldsToCheck = requiredAll
    ? allowedFields
    : Object.keys(body);

  for (const field of fieldsToCheck) {
    if (
      typeof body[field] !== "string" ||
      body[field].trim() === ""
    ) {
      return `${field} must be a non-empty string`;
    }
  }

  if (body.email && !/^\S+@\S+\.\S+$/.test(body.email.trim())) {
    return "Enter a valid email";
  }

  return null;
}

// GET all users
async function handleGetAllUsers(req, res) {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

// GET one user by MongoDB _id
async function handleGetUserById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}

// POST create user
async function handleCreateNewUser(req, res) {
  try {
    const error = validateFields(req.body, true);

    if (error) {
      return res.status(400).json({ error });
    }

    const user = await User.create(req.body);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to create user" });
  }
}

// PATCH update selected fields
async function handleUpdateUserById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Provide fields to update" });
    }

    const error = validateFields(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to update user" });
  }
}

// DELETE user
async function handleDeleteUserById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateNewUser,
  handleUpdateUserById,
  handleDeleteUserById,
};