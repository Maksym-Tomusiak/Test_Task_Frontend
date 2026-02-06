import { useState, useEffect, useCallback } from 'react';
import type {
  DiaryEntry,
  CreateDiaryEntryDto,
  UpdateDiaryEntryDto,
  PaginatedDiaryEntries,
} from '../types';
import { diaryService } from '../services';

export const useDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchEntries = useCallback(
    async (
      page: number = pageNumber,
      search: string = searchTerm,
      start: string = startDate,
      end: string = endDate
    ) => {
      setLoading(true);
      setError(null);

      try {
        const data: PaginatedDiaryEntries = await diaryService.getAll(
          page,
          pageSize,
          search,
          start || undefined,
          end || undefined
        );
        setEntries(data.items);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        setPageNumber(data.pageNumber);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Failed to fetch diary entries';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [pageNumber, pageSize, searchTerm, startDate, endDate]
  );

  const createEntry = useCallback(
    async (data: CreateDiaryEntryDto) => {
      setLoading(true);
      setError(null);

      try {
        await diaryService.create(data);
        // Refetch to get updated pagination
        await fetchEntries(1, searchTerm, startDate, endDate);
        setPageNumber(1);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Failed to create diary entry';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchEntries, searchTerm, startDate, endDate]
  );

  const updateEntry = useCallback(
    async (id: string, data: UpdateDiaryEntryDto) => {
      setLoading(true);
      setError(null);

      try {
        await diaryService.update(id, data);
        // Refetch current page
        await fetchEntries(pageNumber, searchTerm, startDate, endDate);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Failed to update diary entry';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchEntries, pageNumber, searchTerm, startDate, endDate]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await diaryService.delete(id);
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        // Refetch current page
        await fetchEntries(pageNumber, searchTerm, startDate, endDate);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Failed to delete diary entry';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchEntries, pageNumber, searchTerm, startDate, endDate]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setPageNumber(1);
      fetchEntries(1, search, startDate, endDate);
    },
    [fetchEntries, startDate, endDate]
  );

  const handleDateRangeChange = useCallback(
    (start: string, end: string) => {
      setStartDate(start);
      setEndDate(end);
      setPageNumber(1);
      fetchEntries(1, searchTerm, start, end);
    },
    [fetchEntries, searchTerm]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setPageNumber(page);
        fetchEntries(page, searchTerm, startDate, endDate);
      }
    },
    [totalPages, fetchEntries, searchTerm, startDate, endDate]
  );

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
    pageNumber,
    totalPages,
    totalCount,
    searchTerm,
    handleSearch,
    startDate,
    endDate,
    handleDateRangeChange,
    goToPage,
  };
};
