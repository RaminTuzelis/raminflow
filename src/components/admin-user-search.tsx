"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

type AdminUserSearchProps = {
  initialQuery: string;
};

export function AdminUserSearch({ initialQuery }: AdminUserSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    const normalizedTerm = term.trim();

    if (normalizedTerm) {
      params.set("q", normalizedTerm);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();

    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, 300);

  return (
    <form action="/admin/users" method="get" className="w-full max-w-xl">
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>

      <InputGroup>
        <InputGroupInput
          id="user-search"
          type="search"
          name="q"
          value={query}
          onChange={(event) => {
            const nextQuery = event.currentTarget.value;

            setQuery(nextQuery);
            handleSearch(nextQuery);
          }}
          placeholder="Search by name or email"
          autoComplete="off"
        />

        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      <button type="submit" className="sr-only">
        Search users
      </button>
    </form>
  );
}
