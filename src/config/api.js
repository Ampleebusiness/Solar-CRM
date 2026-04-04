/** Central API base URLs and paths used by registration & solar seller flows. */

export const API_BASE_V2 = 'https://www.admin.infrioindia.com/api/v2';

export const AUTH_API_BASE = `${API_BASE_V2}/auth`;

export const AUTH_ENDPOINTS = {
  REGISTER: `${AUTH_API_BASE}/register`,
  VERIFY_EMAIL: `${AUTH_API_BASE}/verify-email`,
};

export const SOLAR_API_BASE = `${API_BASE_V2}/solar`;

export const SOLAR_ENDPOINTS = {
  /** GET — list states `{ id, name }[]` */
  STATES: `${SOLAR_API_BASE}/states`,
  /** GET — cities for a state: `/cities/:stateId` */
  CITIES: (stateId) => `${SOLAR_API_BASE}/cities/${stateId}`,
  /** POST multipart — solar seller registration */
  STORE: `${SOLAR_API_BASE}/store`,
};
