export interface Invite {
  id: string;
  code: string;
  email: string;
  isUsed: boolean;
  expiresAt: string;
}

export interface CreateInviteDto {
  email: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}
