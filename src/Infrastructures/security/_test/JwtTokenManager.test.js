import { describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import JwtTokenManager from '../JwtTokenManager.js';
import config from '../../../Commons/config.js';

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.sign).toBeCalledWith(payload, config.auth.accessTokenKey);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.sign).toBeCalledWith(payload, config.auth.refreshTokenKey);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
    });
  });

  describe('verifyPayload function', () => {
    it('should throw AuthenticationError when authorization header is not provided', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);

      await expect(jwtTokenManager.verifyPayload(undefined))
        .rejects.toThrow('Missing authentication');
    });

    it('should throw AuthenticationError when authorization header is empty', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);

      await expect(jwtTokenManager.verifyPayload(''))
        .rejects.toThrow('Missing authentication');
    });

    it('should throw AuthenticationError when authorization header has no token', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);

      await expect(jwtTokenManager.verifyPayload('Bearer '))
        .rejects.toThrow('Missing authentication');
    });

    it('should throw AuthenticationError when token is invalid', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);

      await expect(jwtTokenManager.verifyPayload('Bearer invalid_token'))
        .rejects.toThrow('Missing authentication');
    });

    it('should return payload when token is valid', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const payload = { username: 'dicoding', id: 'user-123' };
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      const result = await jwtTokenManager.verifyPayload(`Bearer ${accessToken}`);

      expect(result.username).toEqual('dicoding');
      expect(result.id).toEqual('user-123');
    });
  });
});