import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';

describe('LomaX API Integration Tests', () => {
  beforeAll(async () => {
    // Ensure NODE_ENV is set to test
    process.env.NODE_ENV = 'test';
    // Wait for database connection to be active
    if (mongoose.connection.readyState !== 1) {
      await new Promise<void>((resolve) => {
        mongoose.connection.once('open', () => resolve());
      });
    }
  });

  afterAll(async () => {
    // Close mongoose connection after tests
    await mongoose.connection.close();
  });

  describe('GET /api/health', () => {
    it('should return 200 and health details', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail authentication with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          customerId: 'INVALID_CUST',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should successfully authenticate using reversed customerId as password', async () => {
      const User = mongoose.model('User');
      const user = await User.findOne({ customerId: { $exists: true } });
      if (user) {
        const custId = (user as any).customerId;
        const revPassword = custId.split('').reverse().join('');
        
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            customerId: custId,
            password: revPassword
          });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });
  });
});
