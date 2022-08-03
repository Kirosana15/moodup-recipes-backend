import passport from 'passport';
import { Strategy } from '../interfaces/strategy';
import { bearerLogic } from '../strategies/bearer';
import { refreshBearerLogic } from '../strategies/refreshBearer';
import { basicLogic } from '../strategies/basic';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { BasicStrategy } from 'passport-http';

class AuthService {
  private basicStrategy = new BasicStrategy(basicLogic);
  private bearerStrategy = new BearerStrategy(bearerLogic);
  private refreshBearerStrategy = new BearerStrategy(refreshBearerLogic);

  constructor() {
    passport.use(Strategy.Basic, this.basicStrategy);
    passport.use(Strategy.Bearer, this.bearerStrategy);
    passport.use(Strategy.RefreshBearer, this.refreshBearerStrategy);
  }

  public authenticate(strategy: Strategy) {
    return passport.authenticate(strategy, { session: false });
  }
}

export const authService = new AuthService();
