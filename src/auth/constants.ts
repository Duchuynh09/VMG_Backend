
export const jwtConstants = {
  accessSecret: process.env.AUTH_SECRET || 'Truong Sa Va Hoang Sa Cua Viet Nam',
  expireAccess: process.env.AUTH_EXPIRE_IN || '1h',
  refreshSecret: process.env.REFRESH_SECRET || 'Truong Sa Va Hoang Sa Cua Viet Nam',
  expireRefresh: process.env.REFRESH_EXPIRE_IN || '7d'
};
