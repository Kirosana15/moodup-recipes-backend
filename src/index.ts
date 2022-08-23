// eslint-disable-next-line no-useless-escape

import 'dotenv/config';

import mongoose from 'mongoose';
import m2s from 'mongoose-to-swagger';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import app from './app';
import { Recipe } from './models/recipeModel';
import { User } from './models/userModel';

const PORT = process.env.PORT || 300;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dev';

try {
  mongoose.connect(DB_URI);
  console.log('Connected to MongoDB');
} catch (err) {
  console.log(err);
}

//swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Recipes API',
      version: '1.0.0',
      description: 'API for storing recipes in mongoDB database and user authentication using JWT',
    },
    produces: ['application/json'],
    consumes: ['application/json'],
    tags: [
      {
        name: 'Users',
        description: 'Endpoints for users',
      },
      {
        name: 'Recipes',
        description: 'Endpoints for recipes',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
      schemas: {
        User: { ...m2s(User), ...{ properties: { ...m2s(User).properties, __v: { type: 'number' } } } },
        Recipe: { ...m2s(Recipe), ...{ properties: { ...m2s(Recipe).properties, __v: { type: 'number' } } } },
        UserBasicData: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: "Users' id",
            },
            username: {
              type: 'string',
              description: 'Name of the user',
            },
            isAdmin: {
              type: 'boolean',
              description: 'Whether user is an admin',
            },
          },
        },
        TokenData: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: "Users' id",
            },
            username: {
              type: 'string',
              description: 'Name of the user',
            },
            isAdmin: {
              type: 'boolean',
              description: 'Whether user is an admin',
            },
            iat: {
              type: 'number',
              description: 'When token was issued',
            },
            exp: {
              type: 'number',
              description: 'When token expires',
            },
          },
        },
        Login: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Name of the user',
            },
            password: {
              type: 'string',
              description: 'Password of the user',
            },
          },
        },
        Tokens: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'Access token',
            },
            refreshToken: {
              type: 'string',
              description: 'Refresh token',
            },
          },
        },
        NewRecipe: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the recipe',
            },
            imageUrl: {
              type: 'string',
              description: 'Link to an image',
            },
            body: {
              type: 'string',
              description: 'Body of the recipe',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
  servers: [{ url: `http://localhost:${PORT}` }],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app
  .listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
  .on('error', err => {
    console.log(err);
  });
