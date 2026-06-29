import { Request, Response } from 'express';
import { Loan } from '../models/Loan';

export const applyLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, loanType, amount, tenureMonths, purpose, monthlyIncome } = req.body;

    const applicationId = `LN${Math.floor(100000000 + Math.random() * 900000000).toString()}`;
    
    // Simple interest rate logic based on type
    let interestRate = 10.5; // Default
    if (loanType === 'Home Loan') interestRate = 8.5;
    if (loanType === 'Car Loan') interestRate = 9.2;
    if (loanType === 'Personal Loan') interestRate = 12.5;

    const newLoan = new Loan({
      applicationId,
      customerId,
      loanType,
      amount,
      tenureMonths,
      interestRate,
      purpose,
      monthlyIncome,
      status: 'Pending'
    });

    await newLoan.save();

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: newLoan
    });
  } catch (error) {
    console.error('Error applying for loan:', error);
    res.status(500).json({ success: false, message: 'Failed to submit loan application' });
  }
};

export const getLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch loans' });
  }
};

export const updateLoanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const loan = await Loan.findById(id);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    loan.status = status;
    if (status === 'Approved' || status === 'Active') {
      loan.approvedAt = new Date();
    }
    
    await loan.save();

    res.status(200).json({ success: true, message: 'Loan status updated successfully', data: loan });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ success: false, message: 'Failed to update loan status' });
  }
};

export const deleteLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Loan.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Loan application deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({ success: false, message: 'Failed to delete loan application' });
  }
};
