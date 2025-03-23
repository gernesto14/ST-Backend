import "dotenv/config";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import testRouter from "./routes/test.js";

import cors from "cors";
import { initSuperTokens } from "./config/SessionTokens.js";
import supertokens from "supertokens-node";

import { middleware, errorHandler } from "supertokens-node/framework/express";
import pkg from "supertokens-node/framework/express";

import { verifySession } from "supertokens-node/recipe/session/framework/express";

import UserMetadata from "supertokens-node/recipe/usermetadata";

import { deleteAllUnverifiedUsers } from "./lib/misc.js";

const app = express();

// Initialize SuperTokens with the required configurations from the config file.
initSuperTokens();

app.use(cookieParser());

// CORS
const cors_origin = `${process.env.SUPERTOKENS_WEBSITE_DOMAIN}`;
console.log("CORS Origin: ", cors_origin);
app.use(
  cors({
    origin: cors_origin,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
// IMPORTANT: CORS should be before the below line.
// This middleware adds supertokens' default API endpoints to your backend API.
app.use(middleware());
// view engine setup
app.set(
  "views",
  path.join(path.dirname(new URL(import.meta.url).pathname), "views")
);
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  express.static(
    path.join(path.dirname(new URL(import.meta.url).pathname), "public")
  )
);

// deleteAllUnverifiedUsers();

app.use("/", indexRouter);

app.use("/test", testRouter);

app.get("/like-comment", verifySession(), (req, res) => {
  const userId = req.session.getUserId();
  console.log("User ID: ", userId);

  res.json({ userId });
  //....
});

app.get("/metadata", verifySession(), async (req, res) => {
  const session = req.session;
  const userId = session.getUserId();

  const { metadata } = await UserMetadata.getUserMetadata(userId);

  res.json({ data: metadata });
});

// This middleware handles all errors thrown by supertokens.
app.use(errorHandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
