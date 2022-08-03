import passport from 'passport';
import { Strategy } from '../interfaces/strategy';
import { basicStrategy } from '../strategies/basic';
import { bearerStrategy, refreshBearerStrategy } from '../strategies/bearer';

export class AuthService {
  public initializePassportStrategies() {
    passport.use(Strategy.Basic, basicStrategy);
    passport.use(Strategy.Bearer, bearerStrategy);
    passport.use(Strategy.RefreshBearer, refreshBearerStrategy);
  }
}

export const authService = new AuthService();
