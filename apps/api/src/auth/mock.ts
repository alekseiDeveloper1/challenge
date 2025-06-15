
export const mockJwtService = {
  verify: jest.fn(),
  signAsync: jest.fn(),
};

export const mockPrismaService = {
  onModuleInit: jest.fn(),
  $connect: jest.fn(),
  user: {
    findUnique: jest.fn(),
  },
};