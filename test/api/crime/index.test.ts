import axios from "axios";
import { jest } from "@jest/globals";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock auth
jest.mock("@/lib/current-user", () => ({
  currentUser: jest.fn(),
}));
import { currentUser } from "@/lib/current-user";
const mockedCurrentUser = currentUser as jest.MockedFunction<
  typeof currentUser
>;

describe("Crime API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/crime", () => {
    it("should return a list of crimes with vote statistics", async () => {
      // Mock data
      const mockCrimes = [
        {
          id: "1",
          title: "Theft in Downtown",
          description: "A case of robbery at a convenience store",
          location: "Downtown",
          isLive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "user1",
          media: [{ id: "media1", url: "https://example.com/image1.jpg" }],
          comments: [
            {
              id: "comment1",
              content: "This is concerning",
              user: { id: "user2", name: "Jane Doe" },
            },
          ],
          votes: [
            { id: "vote1", value: true, user: { id: "user2" } },
            { id: "vote2", value: false, user: { id: "user3" } },
          ],
          user: { id: "user1", name: "John Doe" },
          voteStats: {
            total: 2,
            upvotes: 1,
            downvotes: 1,
          },
        },
        {
          id: "2",
          title: "Vandalism at Park",
          description: "Property damage at city park",
          location: "Central Park",
          isLive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "user3",
          media: [],
          comments: [],
          votes: [
            { id: "vote3", value: true, user: { id: "user1" } },
            { id: "vote4", value: true, user: { id: "user2" } },
          ],
          user: { id: "user3", name: "Bob Smith" },
          voteStats: {
            total: 2,
            upvotes: 2,
            downvotes: 0,
          },
        },
      ];

      const mockResponse = {
        data: {
          message: "Crimes retrieved successfully.",
          data: mockCrimes,
          status: 200,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(`${API_URL}/api/crime`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Crimes retrieved successfully.");
      expect(response.data.data).toHaveLength(2);
      expect(response.data.data[0].voteStats).toEqual({
        total: 2,
        upvotes: 1,
        downvotes: 1,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/crime`);
    });
  });

  describe("POST /api/crime", () => {
    const crimeData = {
      title: "New Crime Report",
      description: "Description of the incident",
      location: "City Center",
      isLive: true,
    };

    it("should create a new crime report", async () => {
      // Mock response
      const mockCreatedCrime = {
        id: "new-crime-id",
        ...crimeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: null,
      };

      const mockResponse = {
        data: {
          message: "Crime created successfully.",
          data: mockCreatedCrime,
          status: 201,
        },
        status: 201,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(`${API_URL}/api/crime`, crimeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Assertions
      expect(response.status).toBe(201);
      expect(response.data.message).toBe("Crime created successfully.");
      expect(response.data.data.title).toBe(crimeData.title);
      expect(response.data.data.description).toBe(crimeData.description);
      expect(response.data.data.location).toBe(crimeData.location);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/api/crime`,
        crimeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should create a crime report linked to a user", async () => {
      // Modified crime data with userId
      const crimeDataWithUser = {
        ...crimeData,
        userId: "user-123",
      };

      // Mock response
      const mockCreatedCrime = {
        id: "new-crime-id-with-user",
        ...crimeDataWithUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = {
        data: {
          message: "Crime created successfully.",
          data: mockCreatedCrime,
          status: 201,
        },
        status: 201,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(
        `${API_URL}/api/crime`,
        crimeDataWithUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assertions
      expect(response.status).toBe(201);
      expect(response.data.data.userId).toBe(crimeDataWithUser.userId);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/api/crime`,
        crimeDataWithUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });
  });

  describe("PUT /api/crime/:id", () => {
    const updateData = {
      title: "Updated Crime Title",
      description: "Updated description of the incident",
      location: "Updated Location",
    };

    it("should update an existing crime report", async () => {
      const crimeId = "crime-id-123";

      // Mock response
      const mockUpdatedCrime = {
        id: crimeId,
        ...updateData,
        isLive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "user-123",
      };

      const mockResponse = {
        data: {
          message: "Crime updated successfully.",
          data: mockUpdatedCrime,
        },
        status: 200,
      };

      mockedAxios.put.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.put(
        `${API_URL}/api/crime/${crimeId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Crime updated successfully.");
      expect(response.data.data.title).toBe(updateData.title);
      expect(response.data.data.description).toBe(updateData.description);
      expect(response.data.data.location).toBe(updateData.location);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_URL}/api/crime/${crimeId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should return 404 if crime not found", async () => {
      const nonExistentCrimeId = "non-existent-id";

      // Mock error response
      mockedAxios.put.mockRejectedValue({
        response: {
          status: 404,
          data: { message: "Crime not found." },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.put(
          `${API_URL}/api/crime/${nonExistentCrimeId}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fail("Expected request to fail with 404 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ message: "Crime not found." });
        } else {
          throw error;
        }
      }
    });
  });

  describe("GET /api/crime/search", () => {
    it("should search crimes by query", async () => {
      const searchQuery = "Theft";

      // Mock search results
      const mockResults = [
        {
          id: "1",
          title: "Theft in Downtown",
          description: "A case of robbery at a convenience store",
          location: "Downtown",
          isLive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "user1",
          media: [],
          comments: [],
          votes: [{ id: "vote1", value: true, user: { id: "user2" } }],
          user: { id: "user1", name: "John Doe" },
          voteStats: {
            total: 1,
            upvotes: 1,
            downvotes: 0,
          },
        },
      ];

      const mockResponse = {
        data: {
          message: "Search successful.",
          data: mockResults,
          status: 200,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(
        `${API_URL}/api/crime/search?query=${searchQuery}`
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Search successful.");
      expect(response.data.data).toHaveLength(1);
      expect(response.data.data[0].title).toContain(searchQuery);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}/api/crime/search?query=${searchQuery}`
      );
    });

    it("should return empty array if no matching crimes", async () => {
      const searchQuery = "NonExistentCrimeType";

      // Mock empty results
      const mockResponse = {
        data: {
          message: "Search successful.",
          data: [],
          status: 200,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(
        `${API_URL}/api/crime/search?query=${searchQuery}`
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.data).toHaveLength(0);
    });
  });

  describe("GET /api/crime/:id", () => {
    it("should return a specific crime by ID with vote statistics", async () => {
      const crimeId = "crime-id-123";

      // Mock crime data
      const mockCrime = {
        id: crimeId,
        title: "Specific Crime",
        description: "Details of the specific crime",
        location: "Specific Location",
        isLive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "user1",
        media: [{ id: "media1", url: "https://example.com/image1.jpg" }],
        comments: [
          {
            id: "comment1",
            content: "This is a comment",
            user: { id: "user2", name: "Jane Doe" },
          },
        ],
        votes: [
          { id: "vote1", value: true, user: { id: "user2" } },
          { id: "vote2", value: true, user: { id: "user3" } },
          { id: "vote3", value: false, user: { id: "user4" } },
        ],
        user: { id: "user1", name: "John Doe" },
        voteStats: {
          total: 3,
          upvotes: 2,
          downvotes: 1,
        },
      };

      const mockResponse = {
        data: {
          message: "Crime retrieved successfully.",
          data: mockCrime,
          status: 200,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(`${API_URL}/api/crime/${crimeId}`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Crime retrieved successfully.");
      expect(response.data.data.id).toBe(crimeId);
      expect(response.data.data.media).toHaveLength(1);
      expect(response.data.data.comments).toHaveLength(1);
      expect(response.data.data.votes).toHaveLength(3);
      expect(response.data.data.voteStats).toEqual({
        total: 3,
        upvotes: 2,
        downvotes: 1,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}/api/crime/${crimeId}`
      );
    });

    it("should return 404 if crime not found", async () => {
      const nonExistentCrimeId = "non-existent-id";

      // Mock error response
      mockedAxios.get.mockRejectedValue({
        response: {
          status: 404,
          data: { message: "Crime not found." },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.get(`${API_URL}/api/crime/${nonExistentCrimeId}`);
        fail("Expected request to fail with 404 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ message: "Crime not found." });
        } else {
          throw error;
        }
      }
    });
  });

  describe("POST /api/crime/:id/vote", () => {
    const crimeId = "crime-id-123";
    const voteData = { value: true };

    beforeEach(() => {
      // Setup mocked current user
      mockedCurrentUser.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        role: "USER",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    it("should create a new vote on a crime", async () => {
      // Mock vote creation response
      const mockCreatedVote = {
        id: "new-vote-id",
        crimeId,
        userId: "user-123",
        value: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = {
        data: {
          message: "Vote recorded.",
          data: mockCreatedVote,
          status: 201,
        },
        status: 201,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(
        `${API_URL}/api/crime/${crimeId}/vote`,
        voteData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assertions
      expect(response.status).toBe(201);
      expect(response.data.message).toBe("Vote recorded.");
      expect(response.data.data.crimeId).toBe(crimeId);
      expect(response.data.data.value).toBe(voteData.value);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/api/crime/${crimeId}/vote`,
        voteData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should update an existing vote if user votes differently", async () => {
      // Mock vote update response
      const mockUpdatedVote = {
        id: "existing-vote-id",
        crimeId,
        userId: "user-123",
        value: true, // Changed from previous vote
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = {
        data: {
          message: "Vote updated.",
          data: mockUpdatedVote,
          status: 200,
        },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(
        `${API_URL}/api/crime/${crimeId}/vote`,
        voteData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Vote updated.");
      expect(response.data.data.value).toBe(voteData.value);
    });

    it("should remove a vote if user votes the same way twice", async () => {
      // Mock vote removal response
      const mockResponse = {
        data: {
          message: "Vote removed.",
          status: 200,
        },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(
        `${API_URL}/api/crime/${crimeId}/vote`,
        voteData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Vote removed.");
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthorized user
      mockedCurrentUser.mockResolvedValue(null);

      // Mock error response
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { error: "Unauthorized!" },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.post(`${API_URL}/api/crime/${crimeId}/vote`, voteData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        fail("Expected request to fail with 401 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(401);
          expect(error.response.data).toEqual({ error: "Unauthorized!" });
        } else {
          throw error;
        }
      }
    });
  });

  describe("POST /api/crime/:id/comments", () => {
    const crimeId = "crime-id-123";
    const commentData = { content: "This is a test comment" };

    beforeEach(() => {
      // Setup mocked current user
      mockedCurrentUser.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        role: "USER",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    it("should create a new comment on a crime", async () => {
      // Mock comment creation response
      const mockCreatedComment = {
        id: "new-comment-id",
        content: commentData.content,
        crimeId,
        userId: "user-123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        },
      };

      const mockResponse = {
        data: {
          message: "Comment created.",
          data: mockCreatedComment,
          status: 201,
        },
        status: 201,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.post(
        `${API_URL}/api/crime/${crimeId}/comments`,
        commentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assertions
      expect(response.status).toBe(201);
      expect(response.data.message).toBe("Comment created.");
      expect(response.data.data.content).toBe(commentData.content);
      expect(response.data.data.crimeId).toBe(crimeId);
      expect(response.data.data.user.id).toBe("user-123");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/api/crime/${crimeId}/comments`,
        commentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should return 400 if comment content is empty", async () => {
      // Mock bad request response
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: "Comment content is required." },
        },
        isAxiosError: true,
      });

      try {
        // Execute request with empty content
        await axios.post(
          `${API_URL}/api/crime/${crimeId}/comments`,
          { content: "" },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fail("Expected request to fail with 400 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data).toEqual({
            message: "Comment content is required.",
          });
        } else {
          throw error;
        }
      }
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthorized user
      mockedCurrentUser.mockResolvedValue(null);

      // Mock error response
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { error: "Unauthorized!" },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.post(
          `${API_URL}/api/crime/${crimeId}/comments`,
          commentData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fail("Expected request to fail with 401 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(401);
          expect(error.response.data).toEqual({ error: "Unauthorized!" });
        } else {
          throw error;
        }
      }
    });

    it("should return 404 if crime not found", async () => {
      const nonExistentCrimeId = "non-existent-id";

      // Mock not found response
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 404,
          data: { message: "Crime not found." },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.post(
          `${API_URL}/api/crime/${nonExistentCrimeId}/comments`,
          commentData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fail("Expected request to fail with 404 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ message: "Crime not found." });
        } else {
          throw error;
        }
      }
    });
  });

  describe("GET /api/crime/:id/comments", () => {
    const crimeId = "crime-id-123";

    it("should return all comments for a crime", async () => {
      // Mock comments data
      const mockComments = [
        {
          id: "comment1",
          content: "First comment",
          crimeId,
          userId: "user1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: { id: "user1", name: "John Doe" },
        },
        {
          id: "comment2",
          content: "Second comment",
          crimeId,
          userId: "user2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: { id: "user2", name: "Jane Doe" },
        },
      ];

      const mockResponse = {
        data: {
          message: "Comments fetched successfully.",
          data: mockComments,
          status: 200,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(
        `${API_URL}/api/crime/${crimeId}/comments`
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Comments fetched successfully.");
      expect(response.data.data).toHaveLength(2);
      expect(response.data.data[0].crimeId).toBe(crimeId);
      expect(response.data.data[1].crimeId).toBe(crimeId);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}/api/crime/${crimeId}/comments`
      );
    });

    it("should return 404 if crime not found", async () => {
      const nonExistentCrimeId = "non-existent-id";

      // Mock not found response
      mockedAxios.get.mockRejectedValue({
        response: {
          status: 404,
          data: { message: "Crime not found." },
        },
        isAxiosError: true,
      });

      try {
        // Execute request
        await axios.get(`${API_URL}/api/crime/${nonExistentCrimeId}/comments`);
        fail("Expected request to fail with 404 status");
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toEqual({ message: "Crime not found." });
        } else {
          throw error;
        }
      }
    });

    it("should return empty array if no comments exist", async () => {
      // Mock empty comments response
      const mockResponse = {
        data: {
          message: "Comments fetched successfully.",
          data: [],
          status: 200,
        },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Execute request
      const response = await axios.get(
        `${API_URL}/api/crime/${crimeId}/comments`
      );

      // Assertions
      expect(response.status).toBe(200);
      expect(response.data.data).toHaveLength(0);
    });
  });
});
