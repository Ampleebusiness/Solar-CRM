import axios from 'axios';
import { SOLAR_ENDPOINTS } from '../config/api';

/**
 * @returns {Promise<Array<{ id: number, name: string }>>}
 */
export async function fetchSolarStates() {
  const { data } = await axios.get(SOLAR_ENDPOINTS.STATES);
  if (data?.success && Array.isArray(data.data)) {
    return data.data.filter((row) => row && (row.id != null) && row.name);
  }
  return [];
}

/**
 * @param {string|number} stateId
 * @returns {Promise<Array<{ id: number, name: string }>>}
 */
export async function fetchSolarCities(stateId) {
  if (stateId === '' || stateId == null) return [];
  const { data } = await axios.get(SOLAR_ENDPOINTS.CITIES(stateId));
  if (data?.success && Array.isArray(data.data)) {
    return data.data.filter((row) => row && (row.id != null) && row.name);
  }
  return [];
}
