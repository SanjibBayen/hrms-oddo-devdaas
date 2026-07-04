export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export function paginate(query: any): PaginationParams {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}