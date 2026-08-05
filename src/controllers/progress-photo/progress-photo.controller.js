const progressPhotoService = require('../../services/progress-photo/progress-photo.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class ProgressPhotoController {
  create = asyncHandler(async (req, res) => {
    const photo = await progressPhotoService.create(req.user.id, req.body);
    return ApiResponse.created(res, { photo });
  });

  getAll = asyncHandler(async (req, res) => {
    const { category, page, limit } = req.query;
    const result = await progressPhotoService.getAll(req.user.id, { category, page, limit });
    return ApiResponse.paginated(res, result.photos, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const photo = await progressPhotoService.getById(req.params.id, req.user.id);
    return ApiResponse.success(res, { photo });
  });

  update = asyncHandler(async (req, res) => {
    const photo = await progressPhotoService.update(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { photo });
  });

  delete = asyncHandler(async (req, res) => {
    await progressPhotoService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Photo deleted');
  });
}

module.exports = new ProgressPhotoController();
