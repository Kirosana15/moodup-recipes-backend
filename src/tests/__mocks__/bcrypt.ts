export default {
  __esModule: true,
  hash: jest.fn(() => {
    return 'hash';
  }),
  compare: jest.fn(() => {
    return true;
  }),
};
