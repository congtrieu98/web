'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/trpc/react';

interface ProductComboboxProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
}

export function ProductCombobox({
  value,
  onValueChange,
  placeholder = 'Select product...',
}: ProductComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { data: products, isLoading } = api.products.getAllProductsForSelect.useQuery();

  const selectedProduct = React.useMemo(() => {
    if (!value || !products) return null;
    return products.find((product) => product.slug === value);
  }, [value, products]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProduct ? (
            <span className="truncate">{selectedProduct.productName}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading...' : 'No product found.'}
            </CommandEmpty>
            <CommandGroup>
              {products?.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.productName}
                  onSelect={() => {
                    onValueChange(
                      product.slug === value ? undefined : product.slug,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === product.slug ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{product.productName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

