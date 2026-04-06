/** Central API base URLs and paths used by registration & solar seller flows. */

export const API_BASE_V2 = 'https://www.admin.infrioindia.com/api/v2';

export const AUTH_API_BASE = `${API_BASE_V2}/auth`;

export const AUTH_ENDPOINTS = {
  LOGIN: `${AUTH_API_BASE}/login`,
  REGISTER: `${AUTH_API_BASE}/register`,
  VERIFY_EMAIL: `${AUTH_API_BASE}/verify-email`,
  /** POST form-data: `email` — normal user resend (change to `/resend-otp` if your admin uses that) */
  RESEND_OTP: `${AUTH_API_BASE}/resend-otp-verification`,
  /** GET — blog list for guests & normal/partner users (not solar seller) */
  BLOG_LIST: `${AUTH_API_BASE}/blog-list`,
  /** POST JSON body: `{ id }` — blog detail for guests & normal/partner users */
  BLOG_DETAILS: `${AUTH_API_BASE}/blog-details`,
};

export const SOLAR_API_BASE = `${API_BASE_V2}/solar`;

export const SOLAR_ENDPOINTS = {
  /** GET — list states `{ id, name }[]` */
  STATES: `${SOLAR_API_BASE}/states`,
  /** GET — cities for a state: `/cities/:stateId` */
  CITIES: (stateId) => `${SOLAR_API_BASE}/cities/${stateId}`,
  /** POST multipart — solar seller registration */
  STORE: `${SOLAR_API_BASE}/store`,
  /** POST form-data: `email`, `otp` */
  VERIFY_OTP: `${SOLAR_API_BASE}/verify-otp`,
  /** POST form-data: `email` */
  RESEND_OTP: `${SOLAR_API_BASE}/resend-otp`,
  /** POST form-data — typical: `email`+`password` or `phone_number`+`password` (backend dependent) */
  LOGIN: `${SOLAR_API_BASE}/login`,
  /** POST form-data: `solar_user_id` */
  DETAIL: `${SOLAR_API_BASE}/detail`,
  /** POST form-data: `solar_user_id`, `full_name`, `phone_number`, `address`, `state_id`, `city_id` */
  UPDATE: `${SOLAR_API_BASE}/update`,
  /** GET query: optional `solar_user_id`, `state_id`, `city_id`, `page`, `per_page` */
  USERS: `${SOLAR_API_BASE}/users`,
  /** GET query: `page`, `per_page` — response may include `meta` pagination */
  BLOG_LIST: `${SOLAR_API_BASE}/blog-list`,
  /** POST form-data: `id` — single blog `{ title, slug, short_description, description, banner, ... }` */
  BLOG_DETAILS: `${SOLAR_API_BASE}/blog-details`,
};
