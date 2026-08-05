const barcodesService = require('../../services/barcodes/barcodes.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class BarcodesController {
  lookup = asyncHandler(async (req, res) => {
    const record = await barcodesService.lookup(req.params.barcode);
    return ApiResponse.success(res, { barcode: record });
  });

  create = asyncHandler(async (req, res) => {
    const barcode = await barcodesService.create(req.body);
    return ApiResponse.created(res, { barcode }, 'Barcode created');
  });

  delete = asyncHandler(async (req, res) => {
    await barcodesService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Barcode deleted');
  });
}

module.exports = new BarcodesController();
