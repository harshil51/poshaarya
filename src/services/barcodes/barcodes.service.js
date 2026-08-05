const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');

class BarcodesService {
  async lookup(barcodeValue) {
    const prisma = database.getClient();
    const record = await prisma.barcode.findUnique({
      where: { barcode: barcodeValue },
      include: { food: true },
    });
    if (!record) throw new NotFoundError('Barcode not found');
    return record;
  }

  async create(data) {
    const prisma = database.getClient();
    const existing = await prisma.barcode.findUnique({ where: { barcode: data.barcode } });
    if (existing) throw new ConflictError('Barcode already exists');
    return prisma.barcode.create({ data });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.barcode.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Barcode not found');
    await prisma.barcode.delete({ where: { id } });
  }
}

module.exports = new BarcodesService();
