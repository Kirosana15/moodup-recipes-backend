// eslint-disable-next-line no-useless-escape
import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import m2s from "mongoose-to-swagger";

import { User } from "./models/userModel";
import { Recipe } from "./models/recipeModel";

import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import recipeRouter from "./routes/recipeRouter";

const PORT = process.env.PORT || 300;
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/test";

const app: Application = express();

//adding middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

//database connection
try {
  mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.log(err);
}

//swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openApi: "3.0.0",
    info: {
      title: "Recipes API",
      version: "1.0.0",
      description:
        "API for storing recipes in mongoDB database and user authentication using JWT",
    },
    produces: ["application/json"],
    consumes: ["application/json"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Bearer token",
      },
    },
    tags: [
      {
        name: "Users",
        description: "Endpoints for users",
      },
      {
        name: "Recipes",
        description: "Endpoints for recipes",
      },
    ],
    components: {
      schemas: {
        User: m2s(User),
        Recipe: m2s(Recipe),
        Login: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "Name of the user",
            },
            password: {
              type: "string",
              description: "Password of the user",
            },
          },
        },
        Tokens: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "Access token",
            },
            refreshToken: {
              type: "string",
              description: "Refresh token",
            },
          },
        },
        NewRecipe: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the recipe",
            },
            description: {
              type: "string",
              description: "Description of the recipe",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
  servers: [{ url: `http://localhost:${PORT}` }],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routing
app.use(userRouter);
app.use(recipeRouter);

//listening
app
  .listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
  .on("error", (err) => {
    console.log(err);
  });
