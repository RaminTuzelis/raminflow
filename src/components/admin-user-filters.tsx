"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isUserRole, roleOptions, userRoleLabels } from "@/lib/user-options";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

const roleFilterOptions = [
  { value: "ALL", label: "All roles" },
  ...roleOptions.map((role) => ({
    value: role,
    label: userRoleLabels[role],
  })),
];

type AdminUserFiltersProps = {
  initialQuery: string;
};

export function AdminUserFilters({ initialQuery }: AdminUserFiltersProps) {
  const [query, setQuery] = useState(initialQuery);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const roleParam = searchParams.get("role");
  const selectedRole = roleParam && isUserRole(roleParam) ? roleParam : "ALL";

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

  function handleRoleChange(nextRole: string | null) {
    const params = new URLSearchParams(searchParams);

    if (nextRole && isUserRole(nextRole)) {
      params.set("role", nextRole);
    } else {
      params.delete("role");
    }

    const queryString = params.toString();

    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <form
      action="/admin/users"
      method="get"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>

      <InputGroup className="sm:max-w-md">
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

      {selectedRole !== "ALL" && (
        <input type="hidden" name="role" value={selectedRole} />
      )}

      <Select
        items={roleFilterOptions}
        value={selectedRole}
        onValueChange={handleRoleChange}
      >
        <SelectTrigger
          className="w-full sm:w-60 sm:shrink-0"
          aria-label="Filter users by role"
        >
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {roleFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}
