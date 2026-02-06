import { useState, useCallback } from 'react';
import type { Invite, CreateInviteDto, PaginatedResult } from '../types';
import { inviteService } from '../services';

export const useInvites = (initialPageSize = 10) => {
  const [invites, setInvites] = useState<PaginatedResult<Invite> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchInvites = useCallback(
    async (pageNumber = 1, pageSize = initialPageSize) => {
      setLoading(true);
      setError(null);

      try {
        const data = await inviteService.getAll(pageNumber, pageSize);
        setInvites(data);
        setCurrentPage(pageNumber);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Failed to fetch invites';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialPageSize]
  );

  const createInvite = useCallback(
    async (data: CreateInviteDto) => {
      setLoading(true);
      setError(null);

      try {
        await inviteService.create(data);
        // Refresh the list
        await fetchInvites(currentPage);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Failed to create invite';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, fetchInvites]
  );

  const goToPage = useCallback(
    (page: number) => {
      fetchInvites(page);
    },
    [fetchInvites]
  );

  return {
    invites,
    loading,
    error,
    createInvite,
    fetchInvites,
    goToPage,
    currentPage,
  };
};
