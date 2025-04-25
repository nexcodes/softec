import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const prisma = new PrismaClient();

// Mock data for testing
const mockLawyer = {
  legalName: 'Test Lawyer',
  specialization: 'Criminal Law',
  experience: 5,
  description: 'A test lawyer for API testing',
  licenseNo: 'TEST-123456',
  fatherName: 'Test Father',
  cnic: '12345-1234567-1'
};

// Store created IDs for cleanup
let testLawyerId: string;
let testUserId: string;

// Setup and teardown
beforeAll(async () => {
  // Create a test user for our tests with all required fields
  const testUser = await prisma.user.create({
    data: {
      name: 'Test Lawyer User',
      email: `lawyer-test-${Date.now()}@example.com`,
      image: 'https://example.com/test-lawyer.jpg',
      emailVerified: true,
      createdAt: new Date(), // Required field
      updatedAt: new Date(), // Required field
      role: 'USER' // Start as regular user
    }
  });
  testUserId = testUser.id;
  
  // Create a test lawyer profile directly with Prisma (since auth is required via API)
  const testLawyer = await prisma.lawyer.create({
    data: {
      ...mockLawyer,
      isVerified: true, // Set to verified for testing
      userId: testUserId
    }
  });
  testLawyerId = testLawyer.id;
  
  // Update user to be a lawyer
  await prisma.user.update({
    where: { id: testUserId },
    data: { role: 'LAWYER' }
  });
});

afterAll(async () => {
  // Clean up test data
  if (testLawyerId) {
    await prisma.lawyer.delete({
      where: {
        id: testLawyerId
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

describe('Lawyer API', () => {
  describe('GET /api/lawyer/lawyers', () => {
    it('should retrieve all verified lawyers with pagination', async () => {
      // Using correct path for lawyer API
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Verified lawyers retrieved successfully.');
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data).toHaveProperty('metadata');
      expect(response.data.metadata).toHaveProperty('page');
      expect(response.data.metadata).toHaveProperty('limit');
      expect(response.data.metadata).toHaveProperty('totalPages');
      expect(response.data.metadata).toHaveProperty('totalLawyers');
      
      // Verify our test lawyer is in the list
      const foundLawyer = response.data.data.find((lawyer: any) => lawyer.id === testLawyerId);
      expect(foundLawyer).toBeTruthy();
      expect(foundLawyer.legalName).toBe(mockLawyer.legalName);
    });

    it('should handle pagination parameters', async () => {
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers?page=1&limit=5`);
      
      expect(response.status).toBe(200);
      expect(response.data.metadata.page).toBe(1);
      expect(response.data.metadata.limit).toBe(5);
      expect(response.data.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/lawyer/lawyers/:id', () => {
    it('should retrieve a specific lawyer', async () => {
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers/${testLawyerId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Lawyer retrieved successfully.');
      expect(response.data.data.id).toBe(testLawyerId);
      expect(response.data.data.legalName).toBe(mockLawyer.legalName);
      expect(response.data.data.specialization).toBe(mockLawyer.specialization);
      expect(response.data.data.user.id).toBe(testUserId);
    });

    it('should return 404 for non-existent lawyer', async () => {
      try {
        await axios.get(`${API_URL}/api/lawyer/lawyers/non-existent-id`);
        fail('Expected request to fail with 404 status');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data.message).toBe('Lawyer not found.');
        } else {
          throw error;
        }
      }
    });
  });

  describe('GET /api/lawyer/lawyers/search', () => {
    it('should search for lawyers by specialization', async () => {
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers/search?specialization=Criminal`);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('Search results for');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Verify our test lawyer is in the search results
      const foundLawyer = response.data.data.find((lawyer: any) => lawyer.id === testLawyerId);
      expect(foundLawyer).toBeTruthy();
      expect(foundLawyer.specialization).toBe(mockLawyer.specialization);
    });

    it('should handle pagination in search results', async () => {
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers/search?specialization=Criminal&page=1&limit=5`);
      
      expect(response.status).toBe(200);
      expect(response.data.pagination.page).toBe(1);
      expect(response.data.pagination.limit).toBe(5);
      expect(response.data.data.length).toBeLessThanOrEqual(5);
    });
  });

  // Note: The following tests would typically require authentication.
  // In a real environment, you would need to mock the auth or use test tokens.
  // For this example, we'll add tests but comment out the actual execution.

  /* 
  // This test requires authentication
  describe('PUT /api/lawyer/lawyer/profile', () => {
    it('should update a lawyer profile', async () => {
      const updatedData = {
        legalName: 'Updated Test Lawyer',
        specialization: mockLawyer.specialization,
        experience: 6
      };

      // In a real test, you would include authentication headers
      const response = await axios.put(
        `${API_URL}/api/lawyer/lawyer/profile`, 
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${testToken}`
          }
        }
      );
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Lawyer profile updated');
      expect(response.data.data.legalName).toBe(updatedData.legalName);
      expect(response.data.data.experience).toBe(updatedData.experience);
    });
  });

  // This test requires authentication
  describe('DELETE /api/lawyer/lawyers/:id', () => {
    it('should delete a lawyer profile', async () => {
      // In a real test, you would include authentication headers
      const response = await axios.delete(
        `${API_URL}/api/lawyer/lawyers/${testLawyerId}`,
        {
          headers: {
            'Authorization': `Bearer ${testToken}`
          }
        }
      );
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Lawyer deleted successfully.');
      
      // Verify the lawyer is actually deleted
      try {
        await axios.get(`${API_URL}/api/lawyer/lawyers/${testLawyerId}`);
        fail('Expected request to fail with 404 status since lawyer should be deleted');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(404);
        } else {
          throw error;
        }
      }
    });
  });
  */
});
