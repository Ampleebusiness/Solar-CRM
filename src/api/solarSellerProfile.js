import axios from 'axios';
import { SOLAR_ENDPOINTS } from '../config/api';

/** Normalize `/solar/detail` (or update `data`) for UI + localStorage */
export function mapSolarUserToSeller(d) {
  if (!d) return null;
  return {
    id: d.solar_user_id ?? d.id,
    fullName: d.full_name ?? d.name ?? '',
    phone: String(d.phone_number ?? d.phone ?? '').replace(/\D/g, ''),
    email: d.email ?? '',
    address: d.address ?? '',
    state: d.state_name ?? d.state ?? '',
    city: d.city_name ?? d.city ?? '',
    stateId: d.state_id != null ? String(d.state_id) : '',
    cityId: d.city_id != null ? String(d.city_id) : '',
    accessToken: d.access_token,
    refreshToken: d.refresh_token,
  };
}

export async function fetchSolarUserDetail(solarUserId) {
  const fd = new FormData();
  fd.append('solar_user_id', String(solarUserId));
  const { data } = await axios.post(SOLAR_ENDPOINTS.DETAIL, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (data?.success && data.data) {
    return mapSolarUserToSeller(data.data);
  }
  const msg =
    typeof data?.message === 'string'
      ? data.message
      : 'Could not load seller details.';
  throw new Error(msg);
}

export async function updateSolarUserProfile({
  solarUserId,
  full_name,
  phone_number,
  address,
  state_id,
  city_id,
}) {
  const fd = new FormData();
  fd.append('solar_user_id', String(solarUserId));
  fd.append('full_name', String(full_name || '').trim());
  fd.append('phone_number', String(phone_number || '').replace(/\D/g, ''));
  fd.append('address', String(address || '').trim());
  fd.append('state_id', String(state_id));
  fd.append('city_id', String(city_id));
  const { data } = await axios.post(SOLAR_ENDPOINTS.UPDATE, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Merge into existing sellerInfo in localStorage (keeps tokens, etc.) */
export function persistSellerInfoFromApi(mapped) {
  if (typeof window === 'undefined' || !mapped) return;
  let prev = {};
  try {
    prev = JSON.parse(localStorage.getItem('sellerInfo') || '{}') || {};
  } catch {
    prev = {};
  }
  const next = {
    ...prev,
    ...mapped,
    id: mapped.id ?? prev.id,
  };
  localStorage.setItem('sellerInfo', JSON.stringify(next));
}
