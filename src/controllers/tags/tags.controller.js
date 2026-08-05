const tagsService = require('../../services/tags/tags.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class TagsController {
  create = asyncHandler(async (req, res) => {
    const tag = await tagsService.create(req.body);
    return ApiResponse.created(res, { tag }, 'Tag created');
  });

  getAll = asyncHandler(async (req, res) => {
    const tags = await tagsService.getAll();
    return ApiResponse.success(res, { tags });
  });

  getById = asyncHandler(async (req, res) => {
    const tag = await tagsService.getById(req.params.id);
    return ApiResponse.success(res, { tag });
  });

  update = asyncHandler(async (req, res) => {
    const tag = await tagsService.update(req.params.id, req.body);
    return ApiResponse.success(res, { tag }, 'Tag updated');
  });

  delete = asyncHandler(async (req, res) => {
    await tagsService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Tag deleted');
  });
}

module.exports = new TagsController();
