const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');
const { Helpers } = require('../../utils');

class BlogService {
  async create(data, authorId) {
    const prisma = database.getClient();
    const slug = Helpers.generateSlug(data.title);

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Blog with this title already exists');

    return prisma.blog.create({
      data: {
        title: data.title, slug,
        content: data.content,
        featuredImageUrl: data.coverImage || data.featuredImageUrl || null,
        status: data.isPublished ? 'PUBLISHED' : 'DRAFT',
        publishedAt: data.isPublished ? new Date() : null,
        authorId,
      },
    });
  }

  async search({ query, category, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);
    const where = { status: 'PUBLISHED' };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where, skip, take: limit, orderBy: { publishedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, featuredImageUrl: true,
          status: true, publishedAt: true, authorId: true,
        },
      }),
      prisma.blog.count({ where }),
    ]);
    return { blogs, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getById(id) {
    const prisma = database.getClient();
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundError('Blog post not found');
    return blog;
  }

  async getBySlug(slug) {
    const prisma = database.getClient();
    const blog = await prisma.blog.findUnique({ where: { slug } });
    if (!blog) throw new NotFoundError('Blog post not found');
    return blog;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Blog post not found');

    const updateData = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = Helpers.generateSlug(data.title);
    }
    if (data.content !== undefined) updateData.content = data.content;
    if (data.coverImage !== undefined || data.featuredImageUrl !== undefined) {
      updateData.featuredImageUrl = data.coverImage || data.featuredImageUrl;
    }
    if (data.isPublished !== undefined) {
      updateData.status = data.isPublished ? 'PUBLISHED' : 'DRAFT';
      if (data.isPublished && !existing.publishedAt) updateData.publishedAt = new Date();
    }
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.blog.update({ where: { id }, data: updateData });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Blog post not found');
    await prisma.blog.delete({ where: { id } });
  }
}

module.exports = new BlogService();
