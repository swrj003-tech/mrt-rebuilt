import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.category.update({
      where: { slug: 'pet-supplies' },
      data: { image: '/assets/cat-pet.png' }
    });
    console.log('✅ Pet Supplies image updated in DB to /assets/cat-pet.png');
  } catch (err) {
    console.error('❌ Failed to update category:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
