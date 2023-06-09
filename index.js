import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";

import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  photoCreateValidation,
  categoryCreateValidation,
  modelCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import {
  UserController,
  PostController,
  PhotoController,
  CategoryController,
  ModelController,
} from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://bobBegimot:blackWoods2@cluster69.zrzr9lx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/users", UserController.getAllUsers);
app.get("/user/:id", UserController.getFindUser);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

/* app.get("/posts", PostController.getAll); */
app.get("/photo", PhotoController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
/* app.get("/lost", PostController.getFavorite); */
app.post(
  "/posts",
  /* checkAuth, */
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.post(
  "/category",
  /* checkAuth, */
  categoryCreateValidation,
  handleValidationErrors,
  CategoryController.createCategory
);
app.post(
  "/model",
  checkAuth,
  modelCreateValidation,
  handleValidationErrors,
  ModelController.createModel
);
app.get(
  "/posts",
  /* checkAuth, */
  handleValidationErrors,
  PostController.getAllPostUser
);
app.get("/category", handleValidationErrors, CategoryController.getAll);
app.get(
  "/category/:id",
  handleValidationErrors,
  CategoryController.getFindCategory
);
app.get(
  "/find/:category",
  handleValidationErrors,
  CategoryController.getFindCategoryByName
);

app.get(
  "/find/category/:category",
  handleValidationErrors,
  CategoryController.getFindCategoryId
);

app.get("/model", handleValidationErrors, ModelController.getAllModel);
app.get("/model/:id", handleValidationErrors, ModelController.getFindModel);

app.post(
  "/photo",
  checkAuth,
  photoCreateValidation,
  handleValidationErrors,
  PhotoController.createPhoto
);

app.patch(
  "/users/:id/addpost",
  checkAuth,
  photoCreateValidation,
  handleValidationErrors,
  UserController.addPost
);

app.delete("/posts/:id", checkAuth, PostController.remove);
app.delete("/category/:id", checkAuth, CategoryController.remove);

app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});

