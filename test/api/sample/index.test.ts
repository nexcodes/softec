import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Sample API Routes', () => {
  describe('GET /api/sample', () => {
    it('should return a success message', async () => {
      const response = await axios.get(`${API_URL}/api/sample`);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Sample GET Route!' });
    });

    it('should return an error with custom message', async () => {
      try {
        await axios.get(`${API_URL}/api/sample?errorMessage=CustomError`);
        // If we reach here, the request didn't fail as expected
        fail('Expected request to fail with 400 status');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data).toEqual({
            message: 'CustomError',
            method: 'GET',
          });
        } else {
          throw error; // Rethrow if it's not an Axios error
        }
      }
    });
  });

  describe('POST /api/sample', () => {
    it('should return a success message', async () => {
      const response = await axios.post(`${API_URL}/api/sample`);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Sample POST Route!' });
    });

    it('should return an error with custom message', async () => {
      try {
        await axios.post(`${API_URL}/api/sample?errorMessage=CustomError`);
        fail('Expected request to fail with 400 status');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data).toEqual({
            message: 'CustomError',
            method: 'POST',
          });
        } else {
          throw error;
        }
      }
    });
  });

  describe('PATCH /api/sample', () => {
    it('should return a success message', async () => {
      const response = await axios.patch(`${API_URL}/api/sample`);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Sample PATCH Route!' });
    });

    it('should return an error with custom message', async () => {
      try {
        await axios.patch(`${API_URL}/api/sample?errorMessage=CustomError`);
        fail('Expected request to fail with 400 status');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data).toEqual({
            message: 'CustomError',
            method: 'PATCH',
          });
        } else {
          throw error;
        }
      }
    });
  });

  describe('DELETE /api/sample', () => {
    it('should return a success message', async () => {
      const response = await axios.delete(`${API_URL}/api/sample`);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Sample DELETE Route!' });
    });

    it('should return an error with custom message', async () => {
      try {
        await axios.delete(`${API_URL}/api/sample?errorMessage=CustomError`);
        fail('Expected request to fail with 400 status');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          expect(error.response.status).toBe(400);
          expect(error.response.data).toEqual({
            message: 'CustomError',
            method: 'DELETE',
          });
        } else {
          throw error;
        }
      }
    });
  });
});
