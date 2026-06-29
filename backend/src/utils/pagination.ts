import { Model, Document } from 'mongoose';

export interface PaginatedResult<T> {
  success: boolean;
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getPaginatedResults = async <T extends Document>(
  model: Model<T>,
  query: any = {},
  page: number = 1,
  limit: number = 10,
  sort: any = { createdAt: -1 },
  populateFields: any[] = []
): Promise<PaginatedResult<T>> => {
  const parsedPage = Math.max(1, parseInt(String(page)) || 1);
  const parsedLimit = Math.max(1, parseInt(String(limit)) || 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / parsedLimit);

  let dbQuery = model.find(query).sort(sort).skip(skip).limit(parsedLimit);

  for (const field of populateFields) {
    dbQuery = dbQuery.populate(field) as any;
  }

  const data = await dbQuery.exec();

  return {
    success: true,
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: parsedPage,
      limit: parsedLimit,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1
    }
  };
};
