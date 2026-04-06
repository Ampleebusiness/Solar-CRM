import axios from 'axios';
import { SOLAR_ENDPOINTS } from '../config/api';

const DEFAULT_PER_PAGE = 12;

/**
 * @param {{ page?: number, perPage?: number, stateId?: string, cityId?: string, solarUserId?: string|null }} opts
 */
export async function fetchSolarUsersList(opts = {}) {
  const {
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    stateId,
    cityId,
    solarUserId,
  } = opts;

  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('per_page', String(perPage));
  if (stateId) params.append('state_id', String(stateId));
  if (cityId) params.append('city_id', String(cityId));
  if (solarUserId) params.append('solar_user_id', String(solarUserId));

  const { data } = await axios.get(`${SOLAR_ENDPOINTS.USERS}?${params.toString()}`);
  return data;
}

/**
 * Normalize various Laravel / custom shapes into { items, hasMore, nextPage }
 */
export function parseSolarUsersResponse(apiData, page, perPage) {
  const root = apiData?.data;
  let items = [];
  let hasMore = false;
  let nextPage = page + 1;

  if (Array.isArray(root)) {
    items = root;
    hasMore = items.length >= perPage;
  } else if (root && typeof root === 'object') {
    if (Array.isArray(root.data)) {
      items = root.data;
      const last = root.last_page ?? root.lastPage;
      const cur = root.current_page ?? root.currentPage ?? page;
      nextPage = cur + 1;
      hasMore = last != null ? cur < last : items.length >= perPage;
    } else if (Array.isArray(root.users)) {
      items = root.users;
      hasMore = items.length >= perPage;
    } else if (Array.isArray(root.items)) {
      items = root.items;
      hasMore = items.length >= perPage;
    }
  }

  return { items, hasMore, nextPage };
}

const PARTNER_IMAGES = [
  require('../images/solar/partner-01.jpg'),
  require('../images/solar/partner-02.jpg'),
  require('../images/solar/partner-03.jpg'),
  require('../images/solar/partner-04.jpg'),
  require('../images/solar/partner-05.jpg'),
  require('../images/solar/partner-06.jpg'),
  require('../images/solar/partner-07.jpg'),
  require('../images/solar/partner-08.jpg'),
];

export function mapApiSellerToCard(raw, index = 0) {
  const id =
    raw.solar_user_id ??
    raw.id ??
    raw.user_id ??
    `seller-${index}`;
  const city =
    raw.city_name ??
    raw.city ??
    '';
  const state =
    raw.state_name ??
    raw.state ??
    '';
  const location = [city, state].filter(Boolean).join(', ') || '—';
  const img =
    raw.image ||
    raw.image_url ||
    raw.photo ||
    raw.profile_image ||
    PARTNER_IMAGES[Math.abs(Number(id)) % PARTNER_IMAGES.length] ||
    PARTNER_IMAGES[0];

  return {
    id: String(id),
    image: typeof img === 'string' ? img : img,
    membername: raw.full_name || raw.name || raw.company_name || raw.business_name || 'Solar partner',
    position: raw.position || raw.tagline || raw.role || 'Verified solar partner',
    rating: Number(raw.rating) || 5,
    description:
      raw.description ||
      raw.bio ||
      raw.about ||
      raw.address ||
      'Trusted Infrio solar installation partner.',
    location,
  };
}
