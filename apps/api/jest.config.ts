import { config } from '@repo/jest-config/nest';
module.exports = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  ...config
};
