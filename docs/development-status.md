# Development status

Reviewed against application commit `3c29335` on 2026-09-15. This document records the implementation checkpoint; planned features are not claims of completed functionality.

## Current checkpoint

The application includes authenticated order creation, listing, detail and editing, item management, status history, role-aware server permissions, profile pages, and administrator-managed accounts. It is a learning prototype using synthetic data.

Order search and status filtering run on the server. Pagination is partially implemented:

- `src/lib/pagination.ts` validates page input, defines 15 orders per page, calculates the offset, and calculates a minimum of one total page.
- `src/app/page.tsx` reads the page URL parameter and passes the offset to `getOrders()`.
- `src/db/queries.ts` applies shared `orderFilters`, a stable descending order ID sort, and `limit`/`offset`.
- `src/lib/pagination.test.ts` contains tests for parsing, offsets, and total-page calculations.

There is no filtered total-count query or Previous/Next navigation yet. The list currently displays the number of orders on the fetched page, so this is not yet a complete pagination experience. Search and status changes also still need to reset the page.

## Next learning step

First explain the flow from URL parameters to filters, offset, database results, and the rendered list. Then implement and review one small step at a time:

1. Add a filtered PostgreSQL `count(*)` query using the same `orderFilters` as the list query. Count orders without multiplying them by their items.
2. Return the total count alongside the fetched orders and update the caller and UI contract.
3. Use the existing total-page helper and choose explicit behavior for a requested page beyond the available range.
4. Add Previous/Next links that preserve search and status. Reset to page one when filters change or are cleared.
5. Verify empty results, an exact page boundary, a partial final page, invalid page input, an out-of-range page, and combined filters. Check that the displayed total represents all matching orders.

The learner should make the first implementation attempt; guidance starts with reasoning, small hints, and review. This documentation update does not complete the feature or establish new test results.

## Later scope

After pagination, add the acting user to status history. General order and item edits belong in a broader activity model, not in status history. Later extensions include `.xlsx` import with an editable preview and transactional persistence, followed by validated attachments. Legacy Excel formats, statistics, and inventory remain future ideas.

## Continuing on another computer

Run `git status` first. When the worktree is clean, use `git pull --ff-only` before editing. Local environment variables, installed dependencies, and PostgreSQL Docker volumes are not synchronized by Git; preserve existing local data. Inspect the current code again if the application has advanced beyond the checkpoint above.
