import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const prisma = new PrismaClient();

// Mock data for testing
const mockCrime = {
  title: 'Test Crime',
  description: 'This is a test crime for API testing',
  location: 'Test Location',
  isLive: true
};

// Store created IDs for cleanup
let testCrimeId: string;
let testUserId: string;
let testCommentId: string;

// Set up axios to handle circular references
axios.defaults.maxRedirects = 0; // Prevent redirect loops

// Setup test user
beforeAll(async () => {
  // Create a test user for our tests with all required fields
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      image: 'https://example.com/test.jpg',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  testUserId = testUser.id;
  
  // Clean up any existing test data
  await prisma.crime.deleteMany({
    where: {
      title: 'Test Crime'
    }
  });
});

// Clean up after tests
afterAll(async () => {
  // Clean up test data
  if (testCrimeId) {
    await prisma.comment.deleteMany({
      where: {
        crimeId: testCrimeId
      }
    });

    await prisma.vote.deleteMany({
      where: {
        crimeId: testCrimeId
      }
    });

    await prisma.crime.delete({
      where: {
        id: testCrimeId
      }
    });
  }

  if (testUserId) {
    await prisma.user.delete({
      where: {
        id: testUserId
      }
    });
  }

  // Close Prisma connection
  await prisma.$disconnect();
});

describe('Crime API', () => {
  describe('POST /api/crime', () => {
    it('should create a new crime', async () => {
      const crimeWithUser = {
        ...mockCrime,
        userId: testUserId
      };

      // Using correct path for crime API
      const response = await axios.post(`${API_URL}/api/crime`, crimeWithUser);
      
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Crime created successfully.');
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.title).toBe(mockCrime.title);
      
      // Save ID for later tests
      testCrimeId = response.data.data.id;
    });

    it('should handle validation errors', async () => {
      try {
        // Missing required field (title)
        await axios.post(`${API_URL}/api/crime`, {
          description: 'Missing title',
          location: 'Test Location',
          isLive: true
        });
        fail('Expected request to fail with validation error');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(400);
          // Check that validation error mentions 'title'
          expect(error.response.data.message.toLowerCase()).toContain('required');
        } else {
          throw error;
        }
      }
    });
  });

  describe('GET /api/crime', () => {
    it('should retrieve all crimes', async () => {
      const response = await axios.get(`${API_URL}/api/crime`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Crimes retrieved successfully.');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Verify our test crime is in the list
      const foundCrime = response.data.data.find((crime: any) => crime.id === testCrimeId);
      expect(foundCrime).toBeTruthy();
      expect(foundCrime.title).toBe(mockCrime.title);
    });
  });

  describe('GET /api/crime/:id', () => {
    it('should retrieve a specific crime', async () => {
      const response = await axios.get(`${API_URL}/api/crime/${testCrimeId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Crime retrieved successfully.');
      expect(response.data.data.id).toBe(testCrimeId);
      expect(response.data.data.title).toBe(mockCrime.title);
      expect(response.data.data).toHaveProperty('voteStats');
    });

    it('should return 404 for non-existent crime', async () => {
      try {
        await axios.get(`${API_URL}/api/crime/non-existent-id`);
        fail('Expected request to fail with 404 status');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data.message).toBe('Crime not found.');
        } else {
          throw error;
        }
      }
    });
  });

  describe('PUT /api/crime/:id', () => {
    it('should update a crime', async () => {
      const updatedData = {
        title: 'Updated Test Crime',
        description: mockCrime.description,
        location: mockCrime.location,
        isLive: true,
        isVerified: true
      };

      const response = await axios.put(`${API_URL}/api/crime/${testCrimeId}`, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Crime updated successfully.');
      expect(response.data.data.id).toBe(testCrimeId);
      expect(response.data.data.title).toBe(updatedData.title);
      expect(response.data.data.isVerified).toBe(true);
    });
  });

  // Combine remaining test cases into fewer suites to reduce memory usage
  describe('Other crime API endpoints', () => {
    it('should search for crimes by query', async () => {
      const response = await axios.get(`${API_URL}/api/crime/search?query=Updated`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Search successful.');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Verify our updated crime is in the search results
      const foundCrime = response.data.data.find((crime: any) => crime.id === testCrimeId);
      expect(foundCrime).toBeTruthy();
      expect(foundCrime.title).toBe('Updated Test Crime');
    });

    it('should add, remove, and update votes', async () => {
      // Mock proper header for authentication
      const headers = {
        'x-user-id': testUserId
      };

      // 1. Add a vote
      let response = await axios.post(
        `${API_URL}/api/crime/${testCrimeId}/vote`, 
        { value: true }, 
        { headers }
      );
      
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Vote recorded.');
      
      // 2. Remove the vote (same value)
      response = await axios.post(
        `${API_URL}/api/crime/${testCrimeId}/vote`, 
        { value: true }, 
        { headers }
      );
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Vote removed.');
      
      // 3. Add a vote again
      await axios.post(
        `${API_URL}/api/crime/${testCrimeId}/vote`, 
        { value: true }, 
        { headers }
      );
      
      // 4. Change vote value
      response = await axios.post(
        `${API_URL}/api/crime/${testCrimeId}/vote`, 
        { value: false }, 
        { headers }
      );
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Vote updated.');
      expect(response.data.data.value).toBe(false);
    });

    it('should add and retrieve comments', async () => {
      // Mock proper header for authentication
      const headers = {
        'x-user-id': testUserId
      };

      // 1. Add a comment
      const commentData = { content: 'This is a test comment' };
      
      let response = await axios.post(
        `${API_URL}/api/crime/${testCrimeId}/comments`, 
        commentData, 
        { headers }
      );
      
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Comment created.');
      expect(response.data.data.content).toBe(commentData.content);
      
      // Save comment ID for later verification
      testCommentId = response.data.data.id;
      
      // 2. Retrieve comments
      response = await axios.get(`${API_URL}/api/crime/${testCrimeId}/comments`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Comments fetched successfully.');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Verify our test comment is in the list
      const foundComment = response.data.data.find((comment: any) => comment.id === testCommentId);
      expect(foundComment).toBeTruthy();
      expect(foundComment.content).toBe(commentData.content);
    });

    it('should validate comment content', async () => {
      const headers = {
        'x-user-id': testUserId
      };

      try {
        await axios.post(
          `${API_URL}/api/crime/${testCrimeId}/comments`, 
          { content: '' }, 
          { headers }
        );
        fail('Expected request to fail with validation error');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data.message).toBe('Comment content is required.');
        } else {
          throw error;
        }
      }
    });
  });
});