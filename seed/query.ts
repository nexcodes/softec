import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCrimes() {
  console.log('Updating all crimes to be live...');

  const result = await prisma.crime.updateMany({
    data: {
      isLive: true,
    },
  });

  console.log(`Updated ${result.count} crimes to be live.`);

  await prisma.$disconnect();
}

updateCrimes().catch((e) => {
  console.error('Error updating crimes:', e);
  process.exit(1);
});
