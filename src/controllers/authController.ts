import Express from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

// AuthController is a middleware class that handles user authentication

class AuthController {
  // authorizeAdmin checks if the user is an admin
  public async authorizeAdmin(
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }
  }
}

export default AuthController;
