'use client';

import { DataTableSearch } from '@/components/ui/table-comp/data-table-search';
import { useCategoryTableFilters } from './use-category-table-filters';
import { DataTableResetFilter } from '@/components/ui/table-comp/data-table-reset-filter';

export default function CategoryTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useCategoryTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4 h-10">
      <DataTableSearch
        searchKey="name"
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
