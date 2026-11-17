import { expect, it } from 'vitest';
import { assertMockEnvironment } from '../../config/preview';

it('accepts default or explicitly selected mock mode', () => {
  expect(() => assertMockEnvironment({})).not.toThrow();
  expect(() => assertMockEnvironment({ VITE_APP_MODE: 'mock' })).not.toThrow();
});
it.each(['live', 'production', '', 'MOCK'])('rejects unsupported app mode %j', (mode) => {
  expect(() => assertMockEnvironment({ VITE_APP_MODE: mode })).toThrow('Live integrations are unavailable');
});
it.each(['VITE_API_BASE_URL', 'VITE_GATEWAY_SECRET', 'VITE_UNKNOWN_FLAG'])('rejects unapproved public configuration %s without echoing its value', (key) => {
  const value = 'fictional-private-sentinel';
  try { assertMockEnvironment({ [key]: value }); throw new Error('Expected rejection'); }
  catch (error) {
    expect(String(error)).toContain('Unapproved public configuration'); expect(String(error)).not.toContain(value);
  }
});
