import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  mockJwtService,
  mockPrismaService,
} from './mock';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>
    authService = module.get<AuthService>(AuthService)

  });
  describe('refreshTokens', () => {
    it('should return new tokens with valid refresh token', async () => {
      const mockRefreshToken = 'valid.refresh.token';
      const mockEmail = 'my@mail.ru'
      const mockUser = { id: 1, email: mockEmail };

      jwtService.verify.mockReturnValue(mockUser);
      jest.spyOn(authService, 'findByEmail').mockImplementation(() =>
        Promise.resolve(mockUser)
      );
      mockJwtService.signAsync
        .mockResolvedValueOnce('new.access.token')
        .mockResolvedValueOnce('new.refresh.token');
      const result = await authService.refreshTokens(mockRefreshToken);

      // Assert
      expect(result).toEqual({
        access_token: 'new.access.token',
        refresh_token: 'new.refresh.token',
      });
    });

    it('should throw Unauthorized for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.refreshTokens('invalid.token'))
        .rejects.toThrow('Invalid refresh token');
    });
  });
});