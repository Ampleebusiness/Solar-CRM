import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchSolarStates, fetchSolarCities } from '../../api/solarLocations';
import {
  fetchSolarUsersList,
  parseSolarUsersResponse,
  mapApiSellerToCard,
} from '../../api/solarUsers';
import { useAuth } from '../../context/AuthContext';
import { SellerCard } from './Team3';

const PER_PAGE = 12;

export default function SolarSellersBrowse() {
  const { auth } = useAuth();

  const solarUserId = useMemo(() => {
    if (auth?.role !== 'seller') return null;
    const id = auth?.userId;
    if (id == null || id === '') return null;
    return String(id);
  }, [auth?.role, auth?.userId]);

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');

  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);
  const loadLockRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatesLoading(true);
        const list = await fetchSolarStates();
        if (!cancelled) setStatesList(list);
      } catch {
        if (!cancelled) setStatesList([]);
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!stateId) {
      setCitiesList([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        setCitiesLoading(true);
        const list = await fetchSolarCities(stateId);
        if (!cancelled) setCitiesList(list);
      } catch {
        if (!cancelled) setCitiesList([]);
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stateId]);

  const resetAndFetchFirst = useCallback(async () => {
    if (loadLockRef.current) return;
    loadLockRef.current = true;
    setLoading(true);
    setError(null);
    setSellers([]);
    setPage(1);
    setHasMore(true);
    try {
      const raw = await fetchSolarUsersList({
        page: 1,
        perPage: PER_PAGE,
        stateId: stateId || undefined,
        cityId: cityId || undefined,
        solarUserId,
      });
      const { items, hasMore: more } = parseSolarUsersResponse(raw, 1, PER_PAGE);
      const cards = items.map((it, i) => mapApiSellerToCard(it, i));
      setSellers(cards);
      setHasMore(more && items.length > 0);
      setPage(1);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Could not load sellers.');
      setSellers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadLockRef.current = false;
    }
  }, [stateId, cityId, solarUserId]);

  useEffect(() => {
    resetAndFetchFirst();
  }, [resetAndFetchFirst]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore || loadLockRef.current) return;
    loadLockRef.current = true;
    setLoadingMore(true);
    setError(null);
    const nextPage = page + 1;
    try {
      const raw = await fetchSolarUsersList({
        page: nextPage,
        perPage: PER_PAGE,
        stateId: stateId || undefined,
        cityId: cityId || undefined,
        solarUserId,
      });
      const { items, hasMore: more } = parseSolarUsersResponse(raw, nextPage, PER_PAGE);
      setSellers((prev) => {
        const start = prev.length;
        const nextCards = items.map((it, i) => mapApiSellerToCard(it, start + i));
        return [...prev, ...nextCards];
      });
      setPage(nextPage);
      setHasMore(more && items.length > 0);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Could not load more sellers.');
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      loadLockRef.current = false;
    }
  }, [hasMore, loading, loadingMore, page, stateId, cityId, solarUserId]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: '240px', threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [hasMore, loading, loadMore, sellers.length]);

  const resetFilters = () => {
    setStateId('');
    setCityId('');
  };

  return (
    <div className="section-full p-b50 mobile-page-padding bg-gray solar-sellers-section p-t20">
      <div className="container">
        <div className="section-content">
          <p className="m-b30 max-w900 solar-section-intro">
            Compare vetted solar installers and equipment partners. Every seller below is reviewed for workmanship,
            warranty support, and customer satisfaction.
          </p>

          <div className="row m-b30 align-items-end solar-seller-filters">
            <div className="col-md-4 col-sm-6 m-b15">
              <label className="d-block font-12 text-uppercase m-b8 solar-filter-label">State</label>
              <select
                className="form-control solar-filter-select"
                value={stateId}
                onChange={(e) => {
                  setStateId(e.target.value);
                  setCityId('');
                }}
                disabled={statesLoading}
              >
                <option value="">{statesLoading ? 'Loading…' : 'All states'}</option>
                {statesList.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 col-sm-6 m-b15">
              <label className="d-block font-12 text-uppercase m-b8 solar-filter-label">City</label>
              <select
                className="form-control solar-filter-select"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                disabled={!stateId || citiesLoading}
              >
                <option value="">
                  {!stateId ? 'Select state first' : citiesLoading ? 'Loading…' : 'All cities in state'}
                </option>
                {citiesList.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 col-sm-12 m-b15 text-md-right">
              <button type="button" className="site-button-link m-t30 inline-block btn-unstyled" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-warning m-b20" role="alert">
              {error}
            </div>
          )}

          {loading && sellers.length === 0 ? (
            <div className="col-12">
              <p className="text-center p-a30 bg-white radius-md">Loading sellers…</p>
            </div>
          ) : (
            <div className="row team-item-four solar-sellers-grid-page">
              {sellers.length === 0 ? (
                <div className="col-12">
                  <p className="text-center p-a30 bg-white radius-md">No sellers match these filters.</p>
                </div>
              ) : (
                sellers.map((item) => (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 m-b30" key={`${item.id}-${item.membername}`}>
                    <SellerCard item={item} />
                  </div>
                ))
              )}
            </div>
          )}

          {loadingMore && (
            <p className="text-center text-muted m-t15 m-b10" aria-live="polite">
              Loading more…
            </p>
          )}

          <div ref={sentinelRef} className="solar-sellers-sentinel" style={{ height: 1 }} aria-hidden />
        </div>
      </div>
    </div>
  );
}
