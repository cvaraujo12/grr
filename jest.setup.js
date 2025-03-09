// Importa as matchers adicionais do jest-dom
import '@testing-library/jest-dom';

// Configura o fetchMock
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

// Mock para localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

// Mock de ResizeObserver que não existe no ambiente de teste
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suprimir erros de console durante os testes
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 