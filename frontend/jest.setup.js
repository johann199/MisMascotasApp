import '@testing-library/react-native/extend-expect';

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

global.__DEV__ = true;

global.fetch = jest.fn();

//Resetear mocks despues de cada test
afterEach(() => {
  jest.clearAllMocks();
});
