import passport from 'passport';
import { basicStrategy } from '../strategies/basic';
import { bearerStrategy, refreshBearerStrategy } from '../strategies/bearer';

export const initializePassportStrategies = () => {
  passport.use('login', basicStrategy);
  passport.use('access-token', bearerStrategy);
  passport.use('refresh-token', refreshBearerStrategy);
};
