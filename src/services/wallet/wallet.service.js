const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class WalletService {
  async getBalance(userId) {
    const prisma = database.getClient();
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId } });
    }
    return wallet;
  }

  async getTransactions(userId, { page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return { transactions: [], pagination: Helpers.buildPaginationMeta(0, page, limit) };

    const where = { walletId: wallet.id };
    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.walletTransaction.count({ where }),
    ]);

    return { transactions, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async addFunds(userId, data) {
    const prisma = database.getClient();
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId } });
    }

    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: data.amount,
        transactionType: 'CREDIT',
        description: data.description || 'Wallet top-up',
        referenceId: data.referenceId || null,
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: data.amount } },
    });

    return transaction;
  }
}

module.exports = new WalletService();
