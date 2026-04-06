import axios from 'axios';
import { SOLAR_ENDPOINTS } from '../config/api';

const DEFAULT_PER_PAGE = 20;

/**
 * Prefer API `meta`; if missing, infer from list length (infinite scroll).
 */
export function normalizeBlogMeta(apiJson, itemsLength, requestedPage, requestedPerPage) {
  const m = apiJson?.meta;
  const perPage = requestedPerPage || DEFAULT_PER_PAGE;
  const page = requestedPage || 1;

  if (m && typeof m === 'object' && (m.last_page != null || m.total != null || m.current_page != null)) {
    const totalVal = m.total != null ? Number(m.total) : itemsLength;
    const perPg = m.per_page != null ? Number(m.per_page) : perPage;
    const curPg = m.current_page != null ? Number(m.current_page) : page;
    let lastPg = m.last_page != null ? Number(m.last_page) : null;
    if (lastPg == null && totalVal >= 0 && perPg > 0) {
      lastPg = Math.max(1, Math.ceil(totalVal / perPg));
    }
    if (lastPg == null) lastPg = 1;
    return {
      total: totalVal,
      current_page: curPg,
      last_page: lastPg,
      per_page: perPg,
    };
  }

  const lastPage = itemsLength < perPage ? page : page + 1;
  return {
    total: itemsLength,
    current_page: page,
    last_page: lastPage,
    per_page: perPage,
  };
}

/**
 * @param {{ page?: number, perPage?: number }} opts
 */
export async function fetchSolarBlogList(opts = {}) {
  const page = opts.page ?? 1;
  const perPage = opts.perPage ?? DEFAULT_PER_PAGE;
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('per_page', String(perPage));
  const { data } = await axios.get(`${SOLAR_ENDPOINTS.BLOG_LIST}?${params.toString()}`);
  return data;
}

/** Supports `success` or `status`, optional `meta`: `{ total, current_page, last_page, per_page }` */
export function parseSolarBlogListResponse(json, requestedPage, requestedPerPage) {
  const ok = json?.success === true || json?.status === true;
  const items = Array.isArray(json?.data) ? json.data : [];
  const meta = normalizeBlogMeta(json, items.length, requestedPage, requestedPerPage);
  const hasMore = meta.current_page < meta.last_page;
  return { ok, items, meta, hasMore };
}

/**
 * @param {string|number} blogId
 */
export async function fetchSolarBlogDetail(blogId) {
  const fd = new FormData();
  fd.append('id', String(blogId));
  const { data } = await axios.post(SOLAR_ENDPOINTS.BLOG_DETAILS, fd);
  return data;
}

/** `data` is a single object (not array). */
export function parseSolarBlogDetailResponse(json) {
  const ok = json?.success === true || json?.status === true;
  const d = json?.data;
  const detail =
    d && typeof d === 'object' && !Array.isArray(d) ? d : null;
  return { ok, detail, message: typeof json?.message === 'string' ? json.message : '' };
}
