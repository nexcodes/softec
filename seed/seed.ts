import { PrismaClient, Role, MediaType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  await clearDatabase();
  
  // Create users with different roles
  console.log('Creating users...');
  const adminUser = await createAdminUser();
  const regularUsers = await createRegularUsers(20);
  const lawyerUsers = await createLawyerUsers(10);
  
  // Create crimes
  console.log('Creating crimes...');
  const crimes = await createCrimes(regularUsers, 30);
  
  // Create comments
  console.log('Creating comments...');
  await createComments(regularUsers, crimes, 100);
  
  // Create votes
  console.log('Creating votes...');
  await createVotes(regularUsers, crimes, 150);
  
  // Create media
  console.log('Creating media...');
  await createMedia(crimes);

  console.log('✅ Seeding completed successfully');
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  
  // Delete in order to respect foreign key constraints
  await prisma.media.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.crime.deleteMany({});
  await prisma.lawyer.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Database cleared');
}

async function createAdminUser() {
  const hashedPassword = await hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      emailVerified: true,
      image: 'https://i.pravatar.cc/150?u=admin@example.com',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: faker.string.uuid(),
          accountId: faker.string.uuid(),
          providerId: 'credentials',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  
  console.log(`Created admin user: ${admin.email}`);
  return admin;
}

async function createRegularUsers(count: number) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const hashedPassword = await hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        emailVerified: true,
        image: `https://i.pravatar.cc/150?u=${email}`,
        role: Role.USER,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
        accounts: {
          create: {
            id: faker.string.uuid(),
            accountId: faker.string.uuid(),
            providerId: 'credentials',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });
    
    users.push(user);
  }
  
  console.log(`Created ${users.length} regular users`);
  return users;
}

async function createLawyerUsers(count: number) {
  const specializations = [
    'Criminal Law', 
    'Family Law', 
    'Corporate Law', 
    'Intellectual Property', 
    'Immigration Law',
    'Tax Law',
    'Personal Injury',
    'Real Estate Law',
    'Environmental Law',
    'Labor Law'
  ];
  
  const lawyerUsers = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const hashedPassword = await hash('password123', 10);
    
    // Create user with LAWYER role
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        emailVerified: true,
        image: `https://i.pravatar.cc/150?u=${email}`,
        role: Role.LAWYER,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
        accounts: {
          create: {
            id: faker.string.uuid(),
            accountId: faker.string.uuid(),
            providerId: 'credentials',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });
    
    // Create lawyer profile
    const lawyer = await prisma.lawyer.create({
      data: {
        legalName: `${firstName} ${lastName}`,
        userId: user.id,
        specialization: faker.helpers.arrayElement(specializations),
        experience: faker.number.int({ min: 1, max: 25 }),
        description: faker.lorem.paragraph(3),
        licenseNo: `LIC-${faker.string.alphanumeric(8).toUpperCase()}`,
        fatherName: `${faker.person.firstName()} ${lastName}`,
        cnic: faker.string.numeric(5) + '-' + faker.string.numeric(7) + '-' + faker.string.numeric(1),
        isVerified: faker.helpers.arrayElement([true, false, true]), // 2/3 chance to be verified
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
    
    lawyerUsers.push({ user, lawyer });
  }
  
  console.log(`Created ${lawyerUsers.length} lawyer users`);
  return lawyerUsers;
}

async function createCrimes(users: any[], count: number) {
  const crimes = [];
  
  for (let i = 0; i < count; i++) {
    // Some crimes will be anonymous (null userId)
    const shouldBeAnonymous = Math.random() < 0.2; // 20% chance
    const randomUser = faker.helpers.arrayElement(users);
    
    const crime = await prisma.crime.create({
      data: {
        userId: shouldBeAnonymous ? null : randomUser.id,
        title: faker.lorem.sentence(5).replace('.', ''),
        description: faker.lorem.paragraphs(3),
        location: `${faker.location.city()}, ${faker.location.country()}`,
        isLive: faker.helpers.arrayElement([true, false]),
        isVerified: faker.helpers.arrayElement([true, false, null]),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
    
    crimes.push(crime);
  }
  
  console.log(`Created ${crimes.length} crimes`);
  return crimes;
}

async function createComments(users: any[], crimes: any[], count: number) {
  const comments = [];
  
  for (let i = 0; i < count; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const randomCrime = faker.helpers.arrayElement(crimes);
    
    // Some comments can be anonymous (10% chance)
    const isAnonymous = Math.random() < 0.1;
    
    const comment = await prisma.comment.create({
      data: {
        content: faker.lorem.paragraph(),
        userId: isAnonymous ? null : randomUser.id,
        crimeId: randomCrime.id,
        createdAt: faker.date.between({ from: randomCrime.createdAt, to: new Date() }),
      },
    });
    
    comments.push(comment);
  }
  
  console.log(`Created ${comments.length} comments`);
  return comments;
}

async function createVotes(users: any[], crimes: any[], count: number) {
  const votes = [];
  const userCrimePairs = new Set();
  
  // Try to create the requested number of votes, but avoid duplicates
  let attempts = 0;
  while (votes.length < count && attempts < count * 2) {
    attempts++;
    const randomUser = faker.helpers.arrayElement(users);
    const randomCrime = faker.helpers.arrayElement(crimes);
    
    // Check for duplicates (we need unique user-crime pairs)
    const pairKey = `${randomUser.id}-${randomCrime.id}`;
    if (userCrimePairs.has(pairKey)) {
      continue;
    }
    
    userCrimePairs.add(pairKey);
    
    try {
      const vote = await prisma.vote.create({
        data: {
          userId: randomUser.id,
          crimeId: randomCrime.id,
          value: faker.helpers.arrayElement([true, false]),
          createdAt: faker.date.between({ from: randomCrime.createdAt, to: new Date() }),
        },
      });
      
      votes.push(vote);
    } catch (error) {
      console.warn('Failed to create a vote, possibly due to unique constraint violation');
    }
  }
  
  console.log(`Created ${votes.length} votes`);
  return votes;
}

async function createMedia(crimes: any[]) {
  const mediaItems = [];
  
  // Realistic image and video URLs
  const imageSources = [
    '/image.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg',
    '/image5.jpg',
    '/image6.jpg',
    '/image7.jpg',
  ];
  
  const videoSources = [
    '/hero_1.mp4',
    '/hero_2.mp4',
    '/hero_3.mp4',
    '/hero_4.mp4',
    '/hero_5.mp4',
    '/hero_6.mp4',
    '/hero_7.mp4',
    '/hero_8.mp4',
    '/hero_9.mp4',
  ];
  
  // Add 1-4 media items per crime
  for (const crime of crimes) {
    const mediaCount = faker.number.int({ min: 1, max: 4 });
    
    for (let i = 0; i < mediaCount; i++) {
      const mediaType = faker.helpers.arrayElement([MediaType.IMAGE, MediaType.VIDEO]);
      const url = mediaType === MediaType.IMAGE
        ? faker.helpers.arrayElement(imageSources)
        : faker.helpers.arrayElement(videoSources);
      
      const media = await prisma.media.create({
        data: {
          url,
          type: mediaType,
          crimeId: crime.id,
          uploadedAt: faker.date.between({ from: crime.createdAt, to: new Date() }),
        },
      });
      
      mediaItems.push(media);
    }
  }
  
  console.log(`Created ${mediaItems.length} media items`);
  return mediaItems;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });