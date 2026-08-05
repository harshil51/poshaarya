const contactService = require('../../services/contact/contact.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class ContactController {
  create = asyncHandler(async (req, res) => {
    const message = await contactService.create(req.body, req.user?.id);
    return ApiResponse.created(res, { message }, 'Message sent');
  });

  getAll = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await contactService.getAll({ page, limit });
    return ApiResponse.paginated(res, result.messages, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const message = await contactService.getById(req.params.id);
    return ApiResponse.success(res, { message });
  });

  markRead = asyncHandler(async (req, res) => {
    const message = await contactService.markRead(req.params.id);
    return ApiResponse.success(res, { message });
  });

  delete = asyncHandler(async (req, res) => {
    await contactService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Message deleted');
  });
}

module.exports = new ContactController();
