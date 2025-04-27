import { CrimeType, MediaType, PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate a random date within the last 30 days
const getRandomDateInLast30Days = () => {
  const today = new Date(2025, 3, 27); // April 27, 2025
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (today.getTime() - thirtyDaysAgo.getTime())
  );
};

// Pakistan cities with coordinates focusing on Lahore and major cities
const pakistanLocations = [
  // Lahore locations (multiple areas to ensure good distribution across the city)
  {
    name: 'Lahore - Mall Road',
    latitude: 31.5546,
    longitude: 74.3572,
    placeId: 'ChIJJxuC5z4EGTkRiKMF70HO8ZQ',
  },
  {
    name: 'Lahore - Gulberg',
    latitude: 31.5102,
    longitude: 74.3441,
    placeId: 'ChIJlw7JZMMEGTGR0_kPT_PWw5k',
  },
  {
    name: 'Lahore - Defence Housing Authority',
    latitude: 31.4697,
    longitude: 74.4157,
    placeId: 'ChIJP8I9OtEDGTkRMJq3yoLSn-A',
  },
  {
    name: 'Lahore - Johar Town',
    latitude: 31.4697,
    longitude: 74.2719,
    placeId: 'ChIJo9pdnMgEGTkRACz3f4rJn54',
  },
  {
    name: 'Lahore - Model Town',
    latitude: 31.4805,
    longitude: 74.3239,
    placeId: 'ChIJn6QMPcUEGTkRUMaI-5uLJC8',
  },
  {
    name: 'Lahore - Iqbal Town',
    latitude: 31.5012,
    longitude: 74.2937,
    placeId: 'ChIJVVVVVUQEGTkRjMAARlGe-gQ',
  },
  {
    name: 'Lahore - Cantt',
    latitude: 31.552,
    longitude: 74.3399,
    placeId: 'ChIJYbLxHpEDGTkRZBrBZBlx_VU',
  },
  {
    name: 'Lahore - Walled City',
    latitude: 31.5827,
    longitude: 74.3088,
    placeId: 'ChIJ6ebCJdkDGTkR8FVfXNGK4Mg',
  },
  {
    name: 'Lahore - Bahria Town',
    latitude: 31.3674,
    longitude: 74.2144,
    placeId: 'ChIJkxc1S4kHGTkR-FLEtTdUf6k',
  },
  // Other major cities in Pakistan
  {
    name: 'Karachi - Clifton',
    latitude: 24.8075,
    longitude: 67.0311,
    placeId: 'ChIJP1p632s4sz4RGfOkQq0z87Y',
  },
  {
    name: 'Islamabad - F-8',
    latitude: 33.7102,
    longitude: 73.0379,
    placeId: 'ChIJL3KReNC_3zgRRYfXXHZxkV0',
  },
  {
    name: 'Rawalpindi - Saddar',
    latitude: 33.5975,
    longitude: 73.0477,
    placeId: 'ChIJQaa2Hm3A3zgR2l2AEX0-Dns',
  },
  {
    name: 'Faisalabad - D Ground',
    latitude: 31.4187,
    longitude: 73.0791,
    placeId: 'ChIJH8yP_LSdJzkRBVz_xnxpESU',
  },
  {
    name: 'Multan - Gulgasht Colony',
    latitude: 30.1575,
    longitude: 71.5249,
    placeId: 'ChIJXZyyKA2sLDkRQAwH_CfIQCg',
  },
  {
    name: 'Peshawar - University Town',
    latitude: 34.0087,
    longitude: 71.5698,
    placeId: 'ChIJz3kHY_g_2TgRULSXXFQG3Zk',
  },
  {
    name: 'Quetta - Jinnah Road',
    latitude: 30.1898,
    longitude: 67.0166,
    placeId: 'ChIJW0QIXbSFLzkRLiNsR7EnMEo',
  },
  {
    name: 'Sialkot - Cantt',
    latitude: 32.4945,
    longitude: 74.5229,
    placeId: 'ChIJyRniPxn3IDkRRs-lXMuUYdY',
  },
  {
    name: 'Gujranwala - D.C. Colony',
    latitude: 32.1877,
    longitude: 74.1945,
    placeId: 'ChIJdbZmS-RRIDkR_RLzWSekC_c',
  },
  {
    name: 'Sargodha - Block 14',
    latitude: 32.074,
    longitude: 72.6861,
    placeId: 'ChIJfxiDWZg-JzkReJX1R-Fa_IQ',
  },
];

// Crime descriptions that are realistic
const crimeDescriptions = [
  {
    type: CrimeType.HOMICIDE,
    titles: [
      'Fatal shooting in residential area',
      'Body found in abandoned building',
      'Domestic dispute leads to homicide',
    ],
    descriptions: [
      'A victim was found dead with multiple gunshot wounds in what appears to be a targeted attack. Local residents reported hearing multiple gunshots around midnight.',
      'Police responded to a call about a deceased individual found in an apartment. Early investigation suggests possible murder during a home invasion.',
      'The victim was discovered by family members. Initial investigation indicates signs of struggle and multiple stab wounds.',
    ],
  },
  {
    type: CrimeType.ASSAULT,
    titles: [
      'Violent attack outside local market',
      'Group assault on university student',
      'Aggravated assault at residential complex',
    ],
    descriptions: [
      'The victim was attacked by multiple assailants while walking home. Suffered serious injuries including facial fractures and contusions.',
      'A heated argument escalated into physical violence, resulting in the victim being hospitalized with severe injuries.',
      'The victim was assaulted by unknown individuals using blunt objects, resulting in multiple injuries requiring medical attention.',
    ],
  },
  {
    type: CrimeType.THEFT,
    titles: [
      'Motorcycle stolen from parking lot',
      'Mobile phone snatching incident',
      'Pickpocketing at crowded bazaar',
    ],
    descriptions: [
      'A motorcycle was stolen from a parking area in broad daylight. CCTV footage shows suspects breaking the steering lock.',
      'The victim reported having their mobile phone snatched by individuals on a motorcycle who quickly fled the scene.',
      'Multiple reports of valuables being stolen from shoppers in a busy commercial area through distraction techniques.',
    ],
  },
  {
    type: CrimeType.ROBBERY,
    titles: [
      'Armed robbery at local shop',
      'Bank robbery in commercial district',
      'Home invasion robbery at night',
    ],
    descriptions: [
      'Armed suspects entered the premises and demanded cash and valuables. They threatened staff and customers with weapons before fleeing.',
      'Masked individuals conducted a robbery at gunpoint, forcing the staff to hand over cash. No injuries were reported.',
      'The residents were held at gunpoint while robbers searched their home for valuables, making off with cash, jewelry, and electronics.',
    ],
  },
  {
    type: CrimeType.BURGLARY,
    titles: [
      'Break-in at residential property',
      'Office burglary during weekend',
      'Shop burglary reported overnight',
    ],
    descriptions: [
      'Unknown individuals broke into the house by forcing open a window. Multiple valuables were reported missing including electronics and jewelry.',
      'Intruders gained access to the premises by breaking the locks. Office equipment and cash were stolen.',
      'The shop was broken into overnight, with inventory and cash register contents stolen. Security camera footage is being reviewed.',
    ],
  },
  {
    type: CrimeType.ARSON,
    titles: [
      'Deliberate fire at commercial building',
      'Vehicle set ablaze in parking area',
      'Suspected arson at unoccupied property',
    ],
    descriptions: [
      `A fire was deliberately started at the building's entrance. Fire department responded quickly but significant damage was reported.`,
      'A parked vehicle was set on fire during the night. Investigators found evidence of accelerants being used.',
      'An uninhabited building was set on fire, causing substantial damage. Neighboring properties were evacuated as a precaution.',
    ],
  },
  {
    type: CrimeType.VANDALISM,
    titles: [
      'Public property defaced with graffiti',
      'Vehicles damaged in residential area',
      'School property vandalized over weekend',
    ],
    descriptions: [
      'Multiple walls and public structures were defaced with spray paint graffiti overnight, causing extensive damage.',
      'Several parked vehicles had their windows broken and tires slashed in what appears to be random acts of vandalism.',
      'Unknown individuals broke into the school premises and damaged classroom equipment, windows, and furniture.',
    ],
  },
  {
    type: CrimeType.FRAUD,
    titles: [
      'Banking fraud through fake calls',
      'Online shopping scam reported',
      'Identity theft for loan application',
    ],
    descriptions: [
      'The victim received calls from individuals claiming to be bank representatives who convinced them to share account details, resulting in unauthorized transactions.',
      'Multiple victims reported paying for goods online that were never delivered. The fraudulent website has since disappeared.',
      'The complainant discovered their personal information was used to apply for loans and credit cards without their knowledge or consent.',
    ],
  },
  {
    type: CrimeType.KIDNAPPING,
    titles: [
      'Child briefly abducted from school area',
      'Attempted kidnapping in residential neighborhood',
      'Short-term kidnapping for ransom',
    ],
    descriptions: [
      'A minor was abducted while returning from school but was safely recovered after an intensive search operation by police.',
      'Suspects attempted to force an individual into a vehicle. The attempt was thwarted when witnesses intervened.',
      'The victim was held for several hours and released after demands for money were met. Police are investigating based on descriptions provided.',
    ],
  },
  {
    type: CrimeType.CYBERCRIME,
    titles: [
      'Hacking of personal accounts reported',
      'Ransomware attack on local business',
      'Online harassment case filed',
    ],
    descriptions: [
      `The victim's social media and email accounts were compromised, with the hacker attempting to scam contacts.`,
      'A business reported that their computer systems were locked by ransomware, with attackers demanding payment for restoration.',
      'The complainant has been receiving threatening and harassing messages online from anonymous accounts over several weeks.',
    ],
  },
  {
    type: CrimeType.DRUG_TRAFFICKING,
    titles: [
      'Drug distribution network uncovered',
      'Narcotics seized during routine check',
      'Arrest made in drug trafficking case',
    ],
    descriptions: [
      'Police investigation led to the discovery of a drug distribution operation in the area. Multiple suspects were apprehended.',
      'A significant quantity of illegal substances was confiscated during a vehicle inspection at a checkpoint.',
      'Law enforcement conducted a raid based on information received, resulting in the seizure of narcotics and related paraphernalia.',
    ],
  },
];

// Media URLs for crimes (using your public folder assets)
const mediaUrls = [
  { url: '/image.jpg', type: MediaType.IMAGE },
  { url: '/image2.jpg', type: MediaType.IMAGE },
  { url: '/image3.jpg', type: MediaType.IMAGE },
  { url: '/image4.jpg', type: MediaType.IMAGE },
  { url: '/image5.jpg', type: MediaType.IMAGE },
  { url: '/image6.jpg', type: MediaType.IMAGE },
  { url: '/image7.jpg', type: MediaType.IMAGE },
  { url: '/hero_1.mp4', type: MediaType.VIDEO },
  { url: '/hero_2.mp4', type: MediaType.VIDEO },
  { url: '/hero_3.mp4', type: MediaType.VIDEO },
  { url: '/hero_4.mp4', type: MediaType.VIDEO },
];

// Comments for crimes
const commentContents = [
  'I was in the area when this happened. The police response was quick.',
  'Has anyone else witnessed similar incidents in this neighborhood recently?',
  'This is concerning. We need better security measures in this area.',
  'I have surveillance footage that might help. Who should I contact?',
  'The description matches an incident I saw last week. Could be related.',
  'We need more police patrols in this area, especially at night.',
  'This is the third such incident this month. What are the authorities doing?',
  'I live nearby and heard the commotion. Thankfully no one was seriously hurt.',
  'Has anyone started a neighborhood watch group after these incidents?',
  'The community needs to come together to address the rising crime rate.',
  'I reported a suspicious person in the area last week, could be connected.',
  'Are there any updates on this case? Has anyone been apprehended?',
  'This used to be such a safe neighborhood. Things have changed drastically.',
  'My car was broken into last month in the same area. Seems to be a pattern.',
];

// Main seeding function
async function main() {
  console.log('Starting database seeding...');

  // Create test users with different roles
  console.log('Creating test users...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      emailVerified: true,
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: 'admin-account',
          accountId: 'admin-account',
          providerId: 'credentials',
          password: adminPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  console.log('Admin user created:', admin.id);

  // Create moderator user
  const moderatorPassword = await hash('moderator123', 10);
  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@example.com' },
    update: {},
    create: {
      name: 'Moderator User',
      email: 'moderator@example.com',
      emailVerified: true,
      role: Role.MODERATOR,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: 'moderator-account',
          accountId: 'moderator-account',
          providerId: 'credentials',
          password: moderatorPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  console.log('Moderator user created:', moderator.id);

  // Create lawyer user
  const lawyerPassword = await hash('lawyer123', 10);
  const lawyer = await prisma.user.upsert({
    where: { email: 'lawyer@example.com' },
    update: {},
    create: {
      name: 'Lawyer User',
      email: 'lawyer@example.com',
      emailVerified: true,
      role: Role.LAWYER,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: 'lawyer-account',
          accountId: 'lawyer-account',
          providerId: 'credentials',
          password: lawyerPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  console.log('Lawyer user created:', lawyer.id);

  // Create lawyer profile
  await prisma.lawyer.upsert({
    where: { userId: lawyer.id },
    update: {},
    create: {
      id: 'lawyer-profile',
      legalName: 'Adv. Muhammad Anwar',
      userId: lawyer.id,
      specialization: 'Criminal Law',
      experience: 8,
      description:
        'Experienced criminal defense attorney with expertise in handling violent crime cases, fraud, and cybercrime matters.',
      licenseNo: 'PAK-LHR-12345',
      fatherName: 'Abdul Rahman',
      cnic: '35202-1234567-8',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Lawyer profile created for:', lawyer.id);

  // Create regular users
  const regularUserCount = 20;
  const regularUsers = [];

  for (let i = 1; i <= regularUserCount; i++) {
    const userPassword = await hash(`user${i}pass`, 10);
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        name: `Regular User ${i}`,
        email: `user${i}@example.com`,
        emailVerified: true,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: {
          create: {
            id: `user-account-${i}`,
            accountId: `user-account-${i}`,
            providerId: 'credentials',
            password: userPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });
    regularUsers.push(user);
    console.log(`Regular user ${i} created:`, user.id);
  }

  // Create crimes (a larger number to simulate a busy platform)
  console.log('Creating crimes...');
  const crimeCount = 200;
  const createdCrimes = [];

  for (let i = 0; i < crimeCount; i++) {
    // Select a random location (with bias towards Lahore)
    const isLahore = Math.random() < 0.6; // 60% of crimes in Lahore
    let locationIndex;

    if (isLahore) {
      // Select from Lahore locations (first 9 in our array)
      locationIndex = Math.floor(Math.random() * 9);
    } else {
      // Select from other Pakistan cities
      locationIndex =
        9 + Math.floor(Math.random() * (pakistanLocations.length - 9));
    }

    const location = pakistanLocations[locationIndex];

    // Select a random crime type and its description
    const crimeTypeIndex = Math.floor(Math.random() * crimeDescriptions.length);
    const crimeType = crimeDescriptions[crimeTypeIndex];

    // Select a random title and description for this crime type
    const titleIndex = Math.floor(Math.random() * crimeType.titles.length);
    const descriptionIndex = Math.floor(
      Math.random() * crimeType.descriptions.length
    );

    // Random date within the last 30 days
    const incidentDate = getRandomDateInLast30Days();
    const reportedAt = new Date(incidentDate);
    reportedAt.setHours(reportedAt.getHours() + Math.floor(Math.random() * 24)); // Report came 0-24 hours after incident

    // Determine if the crime should be verified
    // Let's say 65% of crimes are verified, 35% pending verification
    const isVerified = Math.random() < 0.65;

    // Assign a random user as the reporter (or null for anonymous report)
    const isAnonymous = Math.random() < 0.3; // 30% chance of anonymous report
    const reporterUserId = isAnonymous
      ? null
      : regularUsers[Math.floor(Math.random() * regularUsers.length)].id;

    // Create the crime record
    const crime = await prisma.crime.create({
      data: {
        title: crimeType.titles[titleIndex],
        description: crimeType.descriptions[descriptionIndex],
        location: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        placeId: location.placeId,
        reportedAt: reportedAt,
        crimeType: crimeType.type,
        incidentDate: incidentDate,
        isLive: true,
        isVerified: isVerified,
        userId: reporterUserId,
      },
    });

    createdCrimes.push(crime);
    console.log(
      `Crime ${i + 1} created:`,
      crime.id,
      crime.title,
      'at',
      location.name
    );

    // Add media to some crimes (70% chance of having media)
    if (Math.random() < 0.7) {
      const mediaCount = Math.floor(Math.random() * 3) + 1; // 1-3 media items

      for (let j = 0; j < mediaCount; j++) {
        const mediaItem =
          mediaUrls[Math.floor(Math.random() * mediaUrls.length)];

        await prisma.media.create({
          data: {
            url: mediaItem.url,
            type: mediaItem.type,
            crimeId: crime.id,
            uploadedAt: reportedAt,
          },
        });
      }
      console.log(`Added ${mediaCount} media items to crime ${crime.id}`);
    }

    // Add comments to some crimes (80% chance of having comments)
    if (Math.random() < 0.8) {
      const commentCount = Math.floor(Math.random() * 8) + 1; // 1-8 comments

      for (let j = 0; j < commentCount; j++) {
        const commentContent =
          commentContents[Math.floor(Math.random() * commentContents.length)];
        const commentDate = new Date(reportedAt);
        commentDate.setHours(
          commentDate.getHours() + Math.floor(Math.random() * 72)
        ); // Comment came 0-72 hours after report

        // 20% chance of anonymous comment
        const commentAnonymous = Math.random() < 0.2;
        const commentUserId = commentAnonymous
          ? null
          : regularUsers[Math.floor(Math.random() * regularUsers.length)].id;

        await prisma.comment.create({
          data: {
            content: commentContent,
            userId: commentUserId,
            crimeId: crime.id,
            createdAt: commentDate,
            pinned: Math.random() < 0.1, // 10% chance of being pinned
          },
        });
      }
      console.log(`Added ${commentCount} comments to crime ${crime.id}`);
    }

    // Add votes to some crimes (90% chance of having votes)
    if (Math.random() < 0.9) {
      // Determine how many users will vote on this crime (between 1 and the total number of regular users)
      const voterCount = Math.floor(Math.random() * regularUsers.length) + 1;

      // Randomly select users to vote without duplicates
      const shuffledUsers = [...regularUsers]
        .sort(() => 0.5 - Math.random())
        .slice(0, voterCount);

      for (const voter of shuffledUsers) {
        // 65% positive votes, 35% negative
        const voteValue = Math.random() < 0.65;

        await prisma.vote.create({
          data: {
            userId: voter.id,
            crimeId: crime.id,
            value: voteValue,
            createdAt: new Date(
              reportedAt.getTime() +
                Math.random() * (Date.now() - reportedAt.getTime())
            ),
          },
        });
      }
      console.log(`Added ${voterCount} votes to crime ${crime.id}`);
    }
  }

  console.log('Database seeding completed successfully!');
}

// Execute the seeding operation
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
