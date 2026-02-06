export interface DiaryEntry {
  id: string;
  content: string;
  entryDate: string;
  hasImage: boolean;
  imageId?: string;
}

export interface PaginatedDiaryEntries {
  items: DiaryEntry[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateDiaryEntryDto {
  content: string;
  image?: File;
}

export interface UpdateDiaryEntryDto {
  content: string;
  image?: File;
  deleteCurrentImage?: boolean;
}
