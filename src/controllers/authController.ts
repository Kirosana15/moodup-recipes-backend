import "dotenv/config";
import * as jwt from "jsonwebtoken";

const TOKEN_KEY = process.env.TOKEN_KEY || "secret";

// AuthController is a middleware class that handles user authentication

class AuthController {
  // authorizeUser verifies the user's token and fills the req.user object with the user's data
  public async authorizeUser(req: any, res: any, next: any) {
    const token = req.headers.authorization;
    if (token) {
      try {
        const decoded = jwt.verify(token, TOKEN_KEY); // decode the token
        req.user = decoded;
        next();
      } catch (err) {
        res.status(401).send("Invalid token. Please refresh your token");
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  }
  // authorizeAdmin checks if the user is an admin
  public async authorizeAdmin(req: any, res: any, next: any) {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  }
}

export default AuthController;
