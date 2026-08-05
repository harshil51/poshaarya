/**
 * Poshaarya API Client
 * Used across dashboard pages to interact with the backend API.
 */

const API_PREFIX = '/api/v1';

const api = {
  /**
   * Helper for fetch requests with standard error handling
   */
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_PREFIX}${endpoint}`, {
        credentials: 'same-origin',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },

  // ─── Auth ────────────────────────────────────────────────
  async getMe() {
    return this.request('/auth/me');
  },

  // ─── Profile & User ──────────────────────────────────────
  async getProfile() {
    return this.request('/profile');
  },
  
  // ─── Daily Calories & Macros ─────────────────────────────
  async getDailySummary(date) {
    const dateStr = date ? `?date=${date}` : '';
    return this.request(`/daily-calories${dateStr}`);
  },

  // ─── Meals ───────────────────────────────────────────────
  async getMeals(date) {
    const dateStr = date ? `?date=${date}` : '';
    return this.request(`/meals${dateStr}`);
  },

  async logMeal(mealData) {
    return this.request('/meals', {
      method: 'POST',
      body: JSON.stringify(mealData)
    });
  },

  // ─── Foods ───────────────────────────────────────────────
  async searchFoods(query) {
    return this.request(`/food/search?query=${encodeURIComponent(query)}`);
  },

  async getRecentFoods() {
    return this.request('/food/recent');
  },

  async getFoodById(id) {
    return this.request(`/food/${id}`);
  },

  // ─── Exercises ───────────────────────────────────────────
  async getExercises(date) {
    const dateStr = date ? `?date=${date}` : '';
    return this.request(`/exercises${dateStr}`);
  }
};
