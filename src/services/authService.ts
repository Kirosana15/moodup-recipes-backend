import passport from 'passport';
import { Strategy } from '../interfaces/strategy';
import { basicStrategy } from '../strategies/basic';
import { bearerStrategy, refreshBearerStrategy } from '../strategies/bearer';

export class AuthService {
  public initializePassportStrategies() {
    passport.use(Strategy.Login, basicStrategy);
    passport.use(Strategy.AccessToken, bearerStrategy);
    passport.use(Strategy.RefreshToken, refreshBearerStrategy);
  }
}

export const authService = new AuthService();
