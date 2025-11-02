'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const CATEGORY_OPTIONS = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Books', label: 'Books' },
  { value: 'Jewelry', label: 'Jewelry' },
  { value: 'Beauty Products', label: 'Beauty Products' },
];
export function usePostTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(''),
  );

  const [postFilter, setPostFilter] = useQueryState(
    'posts',
    searchParams.posts.withOptions({ shallow: false }).withDefault(''),
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setPostFilter(null);

    setPage(1);
  }, [setSearchQuery, setPostFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!setPostFilter;
  }, [searchQuery, setPostFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    postFilter,
    setPostFilter,
  };
}
