import { useCallback, useDeferredValue, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import Pagination from "../components/common/Pagination.jsx";
import ExpertCard from "../components/experts/ExpertCard.jsx";
import ExpertFilters from "../components/experts/ExpertFilters.jsx";
import SearchBar from "../components/experts/SearchBar.jsx";
import { useExperts } from "../hooks/useExperts.js";

function ExpertListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number.parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const deferredSearch = useDeferredValue(search);
  const trimmedSearch = deferredSearch.trim();
  const appliedSearch =
    trimmedSearch.length === 0 || trimmedSearch.length >= 3 ? trimmedSearch : "";

  const updateSearchParams = useCallback(
    (updates) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          nextParams.set(key, String(value));
        } else {
          nextParams.delete(key);
        }
      });

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useExperts({
    page,
    limit: 6,
    category,
    search: appliedSearch,
  });

  const experts = data?.data || [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!pagination?.pages || page <= pagination.pages) {
      return;
    }

    updateSearchParams({ page: pagination.pages });
  }, [page, pagination?.pages, updateSearchParams]);

  return (
    <section className="page">
      <div className="hero-panel">
        <p className="eyebrow">Expert discovery</p>
        <h1>Find the right expert for You</h1>
        <p className="hero-copy">
          Browse by category, search by name, and move straight into a live availability view.
        </p>
      </div>

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={(value) => {
            updateSearchParams({
              search: value.trim() ? value : "",
              page: 1,
            });
          }}
        />
        <ExpertFilters
          activeCategory={category}
          onChange={(value) => {
            updateSearchParams({
              category: value,
              page: 1,
            });
          }}
        />
      </div>

      {isLoading ? <Loader label="Loading experts..." /> : null}
      {isError ? (
        <ErrorState
          message={error?.response?.data?.message || "We could not fetch the experts list."}
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <div className="section-heading">
            <h2>Available experts</h2>
            <p>{isFetching ? "Refreshing..." : `${pagination?.total || 0} experts found`}</p>
          </div>

          {experts.length ? (
            <div className="expert-grid">
              {experts.map((expert) => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </div>
          ) : (
            <div className="feedback-card">
              <p>No experts matched the current filters.</p>
            </div>
          )}

          <Pagination
            currentPage={pagination?.page || 1}
            totalPages={pagination?.pages || 1}
            onPageChange={(value) => updateSearchParams({ page: value })}
          />
        </>
      ) : null}
    </section>
  );
}

export default ExpertListPage;
