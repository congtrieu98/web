'use client';

import { DataTableSearch } from '@/components/ui/table-comp/data-table-search';
import { useBannerTableFilters } from './use-banner-table-filters';
import { DataTableResetFilter } from '@/components/ui/table-comp/data-table-reset-filter';

export default function BannerTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useBannerTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4 h-10">
      <DataTableSearch
        searchKey="title"
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

