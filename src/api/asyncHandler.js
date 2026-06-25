import axios from 'axios';

/**
 * Reusable wrapper for async API queries.
 * Captures network errors and handles parsing to keep UI robust.
 */
export async function apiFetch(url) {
  try {
    const response = await axios.get(url);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error requesting endpoint: ${url}`, error);
    return { 
      data: null, 
      error: error.response?.data?.message || error.message || "Failed to retrieve data" 
    };
  }
}
