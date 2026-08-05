const authService = require('../../services/auth/auth.service');
const tokenService = require('../../services/auth/token.service');
const config = require('../../config/environment');

class WebAuthController {
  async login(req, res, next) {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const result = await authService.login({ email, password, rememberMe: !!rememberMe });
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

      res.cookie('token', result.tokens.accessToken, {
        httpOnly: true,
        secure: config.app.isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge,
      });

      return res.status(200).json({ success: true, redirect: '/dashboard' });
    } catch (err) {
      return res.status(401).json({ success: false, message: err.message || 'Invalid email or password' });
    }
  }

  async signup(req, res, next) {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
      }

      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }

      const result = await authService.register({ firstName, lastName, email, password });

      // We won't automatically log them in or redirect here, since the frontend wants a success modal.
      // But we can still set the cookie just in case, or we skip it.
      // Let's not set the cookie so they are forced to log in after the modal, as requested.
      
      return res.status(200).json({ success: true, message: 'Signup successful' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Registration failed' });
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.cookies?.token;
      if (token) {
        try {
          await authService.logout(null, token, null);
        } catch (_) {}
      }
    } catch (_) {}

    res.clearCookie('token', { path: '/' });
    return res.redirect('/login');
  }
}

module.exports = new WebAuthController();
