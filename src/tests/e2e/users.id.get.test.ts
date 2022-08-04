import { setupTests } from '../setupTests';
import request from 'supertest';
import app from '../../app';
import { mockValidToken, generateToken } from '../mockObjects/mockToken';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import authController from '../../controllers/authController';
