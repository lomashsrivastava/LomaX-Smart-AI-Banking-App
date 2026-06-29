import { Request, Response } from 'express';
import { Branch } from '../models/Branch';

export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    
    // Generate unique Branch ID
    const branchId = `BID${Math.floor(1000 + Math.random() * 9000)}`;

    const newBranch = new Branch({
      ...data,
      branchId,
    });

    await newBranch.save();
    res.status(201).json({ success: true, data: newBranch, message: 'Branch created successfully' });
  } catch (error: any) {
    console.error('Create branch error:', error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Branch Code, IFSC, or Email already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to create branch' });
  }
};

export const getBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, state, district } = req.query;
    const filter: any = {};
    if (country) filter.country = country;
    if (state) filter.state = state;
    if (district) filter.district = district;

    const branches = await Branch.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: branches });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch branches' });
  }
};

export const getBranchRegions = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches = await Branch.find({}, 'country state district').lean();
    
    const regions: Record<string, Record<string, string[]>> = {};
    
    branches.forEach((b: any) => {
      const country = b.country || 'India';
      const state = b.state || 'Delhi';
      const district = b.district || 'New Delhi';
      
      if (!regions[country]) {
        regions[country] = {};
      }
      if (!regions[country][state]) {
        regions[country][state] = [];
      }
      if (!regions[country][state].includes(district)) {
        regions[country][state].push(district);
      }
    });

    res.json({ success: true, regions });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch regions' });
  }
};


export const getBranchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      res.status(404).json({ success: false, message: 'Branch not found' });
      return;
    }
    res.json({ success: true, data: branch });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch branch' });
  }
};

export const updateBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) {
      res.status(404).json({ success: false, message: 'Branch not found' });
      return;
    }
    res.json({ success: true, data: branch, message: 'Branch updated successfully' });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ success: false, message: 'Failed to update branch' });
  }
};

export const deleteBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      res.status(404).json({ success: false, message: 'Branch not found' });
      return;
    }
    res.json({ success: true, message: 'Branch successfully deleted' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete branch' });
  }
};
