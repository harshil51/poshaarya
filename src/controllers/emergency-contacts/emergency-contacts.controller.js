const emergencyContactsService = require('../../services/emergency-contacts/emergency-contacts.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class EmergencyContactsController {
  create = asyncHandler(async (req, res) => {
    const contact = await emergencyContactsService.create(req.user.id, req.body);
    return ApiResponse.created(res, { contact }, 'Emergency contact created');
  });

  getAll = asyncHandler(async (req, res) => {
    const contacts = await emergencyContactsService.getAll(req.user.id);
    return ApiResponse.success(res, { contacts });
  });

  getById = asyncHandler(async (req, res) => {
    const contact = await emergencyContactsService.getById(req.params.id, req.user.id);
    return ApiResponse.success(res, { contact });
  });

  update = asyncHandler(async (req, res) => {
    const contact = await emergencyContactsService.update(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { contact }, 'Emergency contact updated');
  });

  delete = asyncHandler(async (req, res) => {
    await emergencyContactsService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Emergency contact deleted');
  });
}

module.exports = new EmergencyContactsController();
