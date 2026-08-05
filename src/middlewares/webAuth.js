const tokenService = require('../services/auth/token.service');
const database = require('../config/database');

async function webAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = tokenService.decodeAccessToken(token);
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { profile: true },
    });

    if (!user || user.status !== 'ACTIVE' || user.deletedAt) {
      res.clearCookie('token', { path: '/' });
      return res.redirect('/login');
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName || ''}`.trim() || user.email,
    };

    next();
  } catch (err) {
    res.clearCookie('token', { path: '/' });
    return res.redirect('/login');
  }
}

module.exports = webAuth;
