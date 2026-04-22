import prisma from '../server/db.js';

async function check() {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  console.log(cats.map(c => ({ name: c.name, slug: c.slug, products: c._count.products })));
}
check().finally(() => prisma.$disconnect());
