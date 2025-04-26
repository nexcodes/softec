import axios from 'axios';
import { jest } from '@jest/globals';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock auth
jest.mock('@/lib/current-user', () => ({
  currentUser: jest.fn(),
}));
import { currentUser } from '@/lib/current-user';
const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe('Lawyer API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/lawyer', () => {
    it('should return a list of verified lawyers', async () => {
      // Mock data
      const mockLawyers = [
        {
          id: '1',
          legalName: 'John Doe',
          specialization: 'Criminal Law',
          user: { id: '1', email: 'john@example.com' },
        },
        {
          id: '2',
          legalName: 'Jane Smith',
          specialization: 'Family Law',
          user: { id: '2', email: 'jane@example.com' },
        },
      ];

      const mockResponse = {
        data: {
          message: 'Verified lawyers retrieved successfully.',
          data: mockLawyers,
          metadata: {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalLawyers: 2,
          },
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(`${API_URL}/api/lawyer`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Verified lawyers retrieved successfully.');
      expect(response.data.data).toEqual(mockLawyers);
      expect(response.data.metadata).toEqual({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalLawyers: 2,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/lawyer`);
    });

    it('should return empty data when no lawyers found', async () => {
      // Mock empty result
      const mockResponse = {
        data: {
          message: 'No verified lawyers found.',
          data: [],
          metadata: {
            page: 1,
            limit: 10,
            totalPages: 0,
            totalLawyers: 0,
          },
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(`${API_URL}/api/lawyer`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('No verified lawyers found.');
      expect(response.data.data).toEqual([]);
      expect(response.data.metadata).toEqual({
        page: 1,
        limit: 10,
        totalPages: 0,
        totalLawyers: 0,
      });
    });

    it('should handle pagination correctly', async () => {
      // Mock data
      const mockLawyers = [
        {
          id: '3',
          legalName: 'Bob Johnson',
          specialization: 'Corporate Law',
          user: { id: '3' },
        },
      ];

      const mockResponse = {
        data: {
          message: 'Verified lawyers retrieved successfully.',
          data: mockLawyers,
          metadata: {
            page: 2,
            limit: 10,
            totalPages: 2,
            totalLawyers: 11,
          },
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request with pagination
      const response = await axios.get(`${API_URL}/api/lawyer?page=2&limit=10`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.data).toEqual(mockLawyers);
      expect(response.data.metadata).toEqual({
        page: 2,
        limit: 10,
        totalPages: 2,
        totalLawyers: 11,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/lawyer?page=2&limit=10`);
    });
  });

  describe('POST /api/lawyer/lawyer/profile', () => {
    const validLawyerData = {
      legalName: 'John Doe',
      specialization: 'Criminal Law',
      experience: 5,
      description: 'Experienced criminal lawyer',
      licenseNo: 'LIC123456',
      fatherName: 'James Doe',
      cnic: '12345-6789012-3',
    };

    it('should create a lawyer profile for a USER role', async () => {
      // Mock successful response
      const mockCreatedLawyer = {
        id: 'lawyer123',
        ...validLawyerData,
        userId: 'user123',
        isVerified: false,
      };

      const mockResponse = {
        data: {
          message: 'Successfully upgraded to Lawyer',
          data: mockCreatedLawyer,
        },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(
        `${API_URL}/api/lawyer/lawyer/profile`,
        validLawyerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Successfully upgraded to Lawyer');
      expect(response.data.data).toEqual(mockCreatedLawyer);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/api/lawyer/lawyer/profile`,
        validLawyerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      // Mock unauthorized error
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.post(
          `${API_URL}/api/lawyer/lawyer/profile`,
          validLawyerData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        fail('Expected request to fail with 401 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(401);
          expect(error.response.data).toEqual({ error: 'Unauthorized' });
        } else {
          throw error;
        }
      }
    });

    it('should return 400 if user already has a lawyer profile', async () => {
      // Mock bad request error
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'You are already registered as a lawyer' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.post(
          `${API_URL}/api/lawyer/lawyer/profile`,
          validLawyerData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        fail('Expected request to fail with 400 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data).toEqual({ error: 'You are already registered as a lawyer' });
        } else {
          throw error;
        }
      }
    });

    it('should return 403 for non-USER roles', async () => {
      // Mock forbidden error
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 403,
          data: { error: 'Forbidden for your role' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.post(
          `${API_URL}/api/lawyer/lawyer/profile`,
          validLawyerData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        fail('Expected request to fail with 403 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(403);
          expect(error.response.data).toEqual({ error: 'Forbidden for your role' });
        } else {
          throw error;
        }
      }
    });
  });

  describe('PUT /api/lawyer/lawyer/profile', () => {
    const updateData = {
      legalName: 'John Doe Updated',
      specialization: 'Criminal and Family Law',
    };

    it('should update a lawyer profile successfully', async () => {
      // Mock successful response
      const updatedLawyer = {
        id: 'lawyer123',
        userId: 'user123',
        legalName: updateData.legalName,
        specialization: updateData.specialization,
        experience: 5,
        description: 'Experienced criminal lawyer',
        licenseNo: 'LIC123456',
        fatherName: 'James Doe',
        cnic: '12345-6789012-3',
      };

      const mockResponse = {
        data: {
          message: 'Lawyer profile updated',
          data: updatedLawyer,
        },
        status: 200,
      };

      mockedAxios.put.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.put(
        `${API_URL}/api/lawyer/lawyer/profile`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Lawyer profile updated');
      expect(response.data.data).toEqual(updatedLawyer);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_URL}/api/lawyer/lawyer/profile`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      // Mock unauthorized error
      mockedAxios.put.mockRejectedValue({
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.put(
          `${API_URL}/api/lawyer/lawyer/profile`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        fail('Expected request to fail with 401 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(401);
          expect(error.response.data).toEqual({ error: 'Unauthorized' });
        } else {
          throw error;
        }
      }
    });

    it('should return 403 if user is not a lawyer', async () => {
      // Mock forbidden error
      mockedAxios.put.mockRejectedValue({
        response: {
          status: 403,
          data: { error: 'Only a Lawyer can update their profile' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.put(
          `${API_URL}/api/lawyer/lawyer/profile`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        fail('Expected request to fail with 403 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(403);
          expect(error.response.data).toEqual({ error: 'Only a Lawyer can update their profile' });
        } else {
          throw error;
        }
      }
    });

    it('should return 404 if lawyer profile does not exist', async () => {
      // Mock not found error
      mockedAxios.put.mockRejectedValue({
        response: {
          status: 404,
          data: { error: 'Lawyer profile not found' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.put(
          `${API_URL}/api/lawyer/lawyer/profile`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        fail('Expected request to fail with 404 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ error: 'Lawyer profile not found' });
        } else {
          throw error;
        }
      }
    });
  });

  describe('DELETE /api/lawyer/lawyers', () => {
    it('should delete a lawyer profile successfully', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          message: 'Lawyer deleted successfully.',
        },
        status: 200,
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.delete(`${API_URL}/api/lawyer/lawyers`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Lawyer deleted successfully.');
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/api/lawyer/lawyers`);
    });

    it('should return 401 if user is not authenticated', async () => {
      // Mock unauthorized error
      mockedAxios.delete.mockRejectedValue({
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.delete(`${API_URL}/api/lawyer/lawyers`);
        fail('Expected request to fail with 401 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(401);
          expect(error.response.data).toEqual({ error: 'Unauthorized' });
        } else {
          throw error;
        }
      }
    });

    it('should return 404 if lawyer profile does not exist', async () => {
      // Mock not found response
      mockedAxios.delete.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Lawyer not found.' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.delete(`${API_URL}/api/lawyer/lawyers`);
        fail('Expected request to fail with 404 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ message: 'Lawyer not found.' });
        } else {
          throw error;
        }
      }
    });
  });

  describe('GET /api/lawyer/lawyers/:id', () => {
    it('should return a lawyer by ID', async () => {
      // Mock lawyer data
      const mockLawyer = {
        id: 'lawyer123',
        legalName: 'John Doe',
        specialization: 'Criminal Law',
        user: { id: 'user123', email: 'john@example.com' },
      };

      const mockResponse = {
        data: {
          message: 'Lawyer retrieved successfully.',
          data: mockLawyer,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers/lawyer123`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Lawyer retrieved successfully.');
      expect(response.data.data).toEqual(mockLawyer);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/lawyer/lawyers/lawyer123`);
    });

    it('should return 404 if lawyer not found', async () => {
      // Mock not found error
      mockedAxios.get.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Lawyer not found.' },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.get(`${API_URL}/api/lawyer/lawyers/nonexistent`);
        fail('Expected request to fail with 404 status');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ message: 'Lawyer not found.' });
        } else {
          throw error;
        }
      }
    });
  });

  describe('GET /api/lawyer/lawyers/search', () => {
    it('should search lawyers by specialization', async () => {
      // Mock search results
      const mockResults = [
        {
          id: 'lawyer123',
          legalName: 'John Doe',
          specialization: 'Criminal Law',
          user: { id: 'user123', email: 'john@example.com' },
        },
      ];

      const mockResponse = {
        data: {
          message: 'Search results for "Criminal"',
          data: mockResults,
          pagination: {
            page: 1,
            limit: 10,
          },
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers/search?specialization=Criminal`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Search results for "Criminal"');
      expect(response.data.data).toEqual(mockResults);
      expect(response.data.pagination).toEqual({
        page: 1,
        limit: 10,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/lawyer/lawyers/search?specialization=Criminal`);
    });

    it('should support pagination in search', async () => {
      // Mock search results
      const mockResults = [
        {
          id: 'lawyer456',
          legalName: 'Jane Smith',
          specialization: 'Family Law',
          user: { id: 'user456', email: 'jane@example.com' },
        },
      ];

      const mockResponse = {
        data: {
          message: 'Search results for "Family"',
          data: mockResults,
          pagination: {
            page: 2,
            limit: 5,
          },
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request with pagination
      const response = await axios.get(`${API_URL}/api/lawyer/lawyers/search?specialization=Family&page=2&limit=5`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.pagination).toEqual({
        page: 2,
        limit: 5,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/lawyer/lawyers/search?specialization=Family&page=2&limit=5`);
    });
  });
});
