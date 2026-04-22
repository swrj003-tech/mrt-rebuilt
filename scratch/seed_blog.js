import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.blogPost.create({
    data: {
      title: 'The Art of Minimalist Living: Curating Your Space',
      slug: 'art-of-minimalist-living',
      excerpt: 'Discover how to transform your home into a sanctuary of calm and elegance with our curated guide to minimalist living and luxury decor.',
      content: `
        <h2>Embracing the Minimalist Aesthetic</h2>
        <p>In today's fast-paced world, the concept of minimalist living has evolved beyond a mere design trend into a profound lifestyle choice. At MRT International, we believe that true luxury lies in simplicity, quality, and intention.</p>

        <img src="/assets/editorial_v3/explore_cta_bg.png" alt="Minimalist luxury decor setup" />

        <h3>The Philosophy of Less but Better</h3>
        <p>Curating your space isn't about getting rid of everything; it's about making deliberate choices. When you surround yourself only with objects that serve a purpose or bring immense joy, your environment transforms into a sanctuary.</p>

        <blockquote>“Simplicity is the ultimate sophistication.” — Leonardo da Vinci</blockquote>

        <h3>Key Elements of a Minimalist Space</h3>
        <ul>
            <li><strong>Neutral Palettes:</strong> Use soft whites, warm beiges, and deep charcoals to create a calming foundation.</li>
            <li><strong>Natural Textures:</strong> Incorporate materials like linen, raw wood, and stone to add warmth without visual clutter.</li>
            <li><strong>Statement Pieces:</strong> Allow one or two high-quality items to anchor the room.</li>
            <li><strong>Unobscured Light:</strong> Maximize natural light to make spaces feel open and serene.</li>
        </ul>

        <p>By thoughtfully selecting each piece in your home, you cultivate an environment that reflects clarity and sophisticated taste. Explore our Home & Decor collection to find the perfect additions to your minimalist sanctuary.</p>
      `,
      coverImage: '/assets/editorial_v3/explore_cta_bg.png',
      author: 'MRT Editorial Team',
      isPublished: true,
    },
  });

  console.log('Sample blog post created:', post.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
