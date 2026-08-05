const blogService = require('../../services/blog/blog.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class BlogController {
  create = asyncHandler(async (req, res) => {
    const blog = await blogService.create(req.body, req.user.id);
    return ApiResponse.created(res, { blog });
  });

  search = asyncHandler(async (req, res) => {
    const { query, category, page, limit } = req.query;
    const result = await blogService.search({ query, category, page, limit });
    return ApiResponse.paginated(res, result.blogs, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const blog = await blogService.getById(req.params.id);
    return ApiResponse.success(res, { blog });
  });

  getBySlug = asyncHandler(async (req, res) => {
    const blog = await blogService.getBySlug(req.params.slug);
    return ApiResponse.success(res, { blog });
  });

  update = asyncHandler(async (req, res) => {
    const blog = await blogService.update(req.params.id, req.body);
    return ApiResponse.success(res, { blog });
  });

  delete = asyncHandler(async (req, res) => {
    await blogService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Blog deleted');
  });
}

module.exports = new BlogController();
