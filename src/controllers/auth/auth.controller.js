const authService = require('../../services/auth/auth.service');
const { ApiResponse, asyncHandler } = require('../../utils');

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const result = await authService.register({ firstName, lastName, email, password, phone });
    this._setRefreshTokenCookie(res, result.tokens.refreshToken);
    this._setAccessTokenCookie(res, result.tokens.accessToken);
    return ApiResponse.created(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const result = await authService.login({ email, password, rememberMe });
    this._setRefreshTokenCookie(res, result.tokens.refreshToken, rememberMe);
    this._setAccessTokenCookie(res, result.tokens.accessToken, rememberMe);
    return ApiResponse.success(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  });

  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] || req.body.refreshToken;
    const accessToken = this._extractToken(req);
    await authService.logout(req.user.id, accessToken, refreshToken);
    this._clearRefreshTokenCookie(res);
    this._clearAccessTokenCookie(res);
    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  logoutAllDevices = asyncHandler(async (req, res) => {
    const accessToken = this._extractToken(req);
    await authService.logoutAllDevices(req.user.id, accessToken);
    this._clearRefreshTokenCookie(res);
    return ApiResponse.success(res, null, 'Logged out from all devices successfully');
  });

  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] || req.body.refreshToken;
    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token is required', 401);
    }
    const tokens = await authService.refreshAccessToken(refreshToken);
    this._setRefreshTokenCookie(res, tokens.refreshToken);
    this._setAccessTokenCookie(res, tokens.accessToken);
    return ApiResponse.success(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await authService.verifyEmail(email, otp);
    return ApiResponse.success(res, { user }, 'Email verified successfully');
  });

  resendVerificationOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.resendVerificationOTP(email);
    return ApiResponse.success(res, null, 'Verification OTP sent successfully');
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return ApiResponse.success(res, null, result.message);
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;
    const result = await authService.resetPassword(email, otp, password);
    return ApiResponse.success(res, null, result.message);
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    return ApiResponse.success(res, null, 'Password changed successfully');
  });

  getCurrentUser = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);
    return ApiResponse.success(res, { user });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, { user }, 'Profile updated successfully');
  });

  getProfile = asyncHandler(async (req, res) => {
    const profile = await authService.getProfile(req.user.id);
    return ApiResponse.success(res, { profile });
  });

  deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;
    await authService.deleteAccount(req.user.id, password);
    this._clearRefreshTokenCookie(res);
    this._clearAccessTokenCookie(res);
    return ApiResponse.success(res, null, 'Account deleted successfully');
  });

  updateEmail = asyncHandler(async (req, res) => {
    const { newEmail, password } = req.body;
    await authService.updateEmail(req.user.id, newEmail, password);
    return ApiResponse.success(res, null, 'Verification email sent to new address');
  });

  _setRefreshTokenCookie(res, refreshToken, rememberMe = false) {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, { ...COOKIE_OPTIONS, maxAge });
  }

  _setAccessTokenCookie(res, accessToken, rememberMe = false) {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', accessToken, { ...COOKIE_OPTIONS, maxAge });
  }

  _clearRefreshTokenCookie(res) {
    res.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
  }

  _clearAccessTokenCookie(res) {
    res.clearCookie('token', COOKIE_OPTIONS);
  }

  _extractToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}

module.exports = new AuthController();
