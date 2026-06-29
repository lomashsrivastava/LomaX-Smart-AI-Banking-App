import { transferMoney } from '../controllers/transactionController';
import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import User from '../models/User';

// Mock the models
jest.mock('../models/Transaction');
jest.mock('../models/Account');
jest.mock('../models/User');
jest.mock('../models/LedgerEntry');
jest.mock('../services/notificationService', () => ({
  createNotification: jest.fn().mockResolvedValue(true)
}));

describe('Transaction Controller - transferMoney', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseData: any;
  let responseStatus: number;

  beforeEach(() => {
    jest.clearAllMocks();
    responseData = null;
    responseStatus = 200;

    mockResponse = {
      status: jest.fn().mockImplementation((code) => {
        responseStatus = code;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((data) => {
        responseData = data;
        return mockResponse;
      })
    } as any;
  });

  it('should return error if amount is invalid or negative', async () => {
    mockRequest = {
      body: {
        transferType: 'Internal Transfer',
        sourceAccount: 'ACC123',
        targetAccount: 'ACC456',
        amount: -500
      }
    };

    await transferMoney(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toContain('Invalid transfer amount');
  });

  it('should return error if source account does not exist', async () => {
    mockRequest = {
      body: {
        transferType: 'Internal Transfer',
        sourceAccount: 'ACC123_NONEXISTENT',
        targetAccount: 'ACC456',
        amount: 1000
      }
    };

    (Account.findOne as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue(null) // Mock finding no account in session
    });

    await transferMoney(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(500);
    expect(responseData.success).toBe(false);
  });
});
