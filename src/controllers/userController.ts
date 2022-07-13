//Controller for user authentication
import 'dotenv/config';
import UserService from '../services/userService';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';
const userService = new UserService();

//UserController class for user related requests
class UserController {
    //Register a new user with provided username and password
    //password is hashed before storing in the database
    public async register(req: any, res: any) {
        if(req.body.password && req.body.username) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            userService.createUser(req.body.username, req.body.password)
                .then((user: any) => {
                    res.status(201).send(user);
                }).catch((err: any) => {
                    if (err.code === 11000) {
                        res.status(400).send('User already exists');
                    } else {
                        res.status(400).send(err);
                    }
                }
            );
        } else {
            res.status(400).send('Missing username or password');
        }
    }
    //Authenticate a user with provided username and password
    public async login(req: any, res: any, next: any) {
        if (req.body.password && req.body.username) {
            userService.getUser(req.body.username)
                .then((user: any) => {
                    if (user) {
                        user.comparePassword(req.body.password)
                        .then((isValid: boolean) => {
                            if (isValid) {
                                req.user = user;
                                next();
                            } else {
                                res.status(401).send('Invalid password');
                            }
                        });
                    } else {
                        res.status(404).send('User not found');
                    }
                })
                .catch ((err:any) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(400).send('Missing username or password');
        }
    }

    //Provides logged in user data to the client
    public async getProfile(req: any, res: any) {
        if (req.user) {
            res.status(200).send(req.user);
        } else {
            res.status(401).send('Unauthorized');
        }
    }

    //Provides a list of all users
    public async getAllUsers(req: any, res: any) {
        userService.getAllUsers(req.query.page, req.query.limit)
            .then((users: any) => {
                res.status(200).send(users);
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }

    //Provides data of a user with provided id
    public async getUser(req: any, res: any) {
        userService.getUser(req.params.id)
            .then((user: any) => {
                if (user) {
                    res.status(200).send(user);
                } else {
                    res.status(404).send('User not found');
                }
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }

    //Deletes a user with provided id
    public async removeUser(req: any, res: any) {
        userService.removeUser(req.params.id)
            .then((user: any) => {
                if (user) {
                    res.status(200).send(user);
                } else {
                    res.status(404).send('User not found');
                }
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }

    //Validates a refresh token and fetches user data if valid
    public async refreshToken(req: any, res: any, next: any) {
        var token = req.headers.authorization;
        if (token) {
            jwt.verify(token, TOKEN_KEY, (err: any, decoded: any) => {
                if (err) {
                    res.status(401).send(err);
                } else {
                    userService.getUserById(decoded.id)
                    .then((user: any) => {
                        if (user) {
                            if (user.compareToken(token)) {
                                req.user = user;
                                next();
                            } else {
                                res.status(401).send('Invalid token');
                            }
                        } else {
                            res.status(404).send('User not found');
                        }
                    }).catch((err: any) => {
                        res.status(400).send(err);
                    });
                }
            });
        } else {
            res.status(401).send('Unauthorized');
        }
    }

    //Generates a new set of tokens for the user
    //New refresh token is stored and old one is invalidated
    public async generateToken(req: any, res: any) {
        const accessToken = jwt.sign({ id: req.user._id, username: req.user.username, isAdmin: req.user.isAdmin }, TOKEN_KEY, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: req.user._id }, TOKEN_KEY, { expiresIn: "30m" });
        userService.updateRefreshToken(req.user._id, refreshToken)
            .then(() => {
                res.status(200).send({ accessToken, refreshToken });
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
}

export default UserController;