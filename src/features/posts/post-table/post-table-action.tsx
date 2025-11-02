'use client';

import { DataTableSearch } from '@/components/ui/table-comp/data-table-search';
import { usePostTableFilters } from './use-post-table-filters';
import { DataTableResetFilter } from '@/components/ui/table-comp/data-table-reset-filter';

export default function ProductTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = usePostTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4 h-10">
      <DataTableSearch
        searchKey="productName"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
