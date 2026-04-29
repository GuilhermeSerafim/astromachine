import { describe, expect, it } from 'vitest';
import { getApiBaseUrlCandidates, normalizeBaseUrl } from './apiConfig';

describe('apiConfig', () => {
  it('normalizes http urls and rejects invalid values', () => {
    expect(normalizeBaseUrl(' http://192.168.0.10:3001/ ')).toBe('http://192.168.0.10:3001');
    expect(normalizeBaseUrl('localhost:3001')).toBeNull();
    expect(normalizeBaseUrl('')).toBeNull();
  });

  it('prefers Expo LAN host before emulator and localhost candidates', () => {
    expect(
      getApiBaseUrlCandidates({
        platformOS: 'android',
        expoHost: '192.168.0.20:8081',
        bundleHost: '192.168.0.21',
        envUrl: 'http://api.local:3001',
        port: '3001',
      })
    ).toEqual([
      'http://192.168.0.20:3001',
      'http://192.168.0.21:3001',
      'http://api.local:3001',
      'http://10.0.2.2:3001',
      'http://localhost:3001',
    ]);
  });
});
