const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class Helpers {
  static generateOTP(digits = 6) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  static generateUUID() {
    return uuidv4();
  }

  static generateToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  static generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static sanitizeHtml(input) {
    const xss = require('xss');
    if (typeof input === 'string') {
      return xss(input.trim());
    }
    if (Array.isArray(input)) {
      return input.map((item) => this.sanitizeHtml(item));
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeHtml(value);
      }
      return sanitized;
    }
    return input;
  }

  static calculatePagination(page = 1, limit = 10) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(Math.max(1, parseInt(limit, 10) || 10), 100);
    const skip = (p - 1) * l;
    return { page: p, limit: l, skip };
  }

  static buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  static calculateAge(dateOfBirth) {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  static calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 100) / 100;
  }

  static getBMICategory(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  static calculateBMR(gender, weightKg, heightCm, age) {
    if (gender === 'male') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    }
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  static calculateTDEE(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
  }

  static calculateMacros(calories, ratio) {
    return {
      protein: Math.round((calories * (ratio.protein / 100)) / 4),
      carbs: Math.round((calories * (ratio.carbs / 100)) / 4),
      fat: Math.round((calories * (ratio.fat / 100)) / 9),
      fiber: Math.round((calories * 0.014) / 4),
    };
  }

  static calculateCalorieGoal(tdee, goalType) {
    switch (goalType) {
      case 'weight_loss':
        return tdee - 500;
      case 'weight_gain':
        return tdee + 500;
      case 'build_muscle':
        return tdee + 300;
      case 'maintain_weight':
      case 'general_fitness':
      default:
        return tdee;
    }
  }

  static parseDuration(duration) {
    const regex = /^(\d+)\s*(s|m|h|d|w)$/;
    const match = duration.match(regex);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
    return value * (multipliers[unit] || 0);
  }

  static truncate(str, length = 100) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  }

  static maskEmail(email) {
    const [name, domain] = email.split('@');
    const masked = name.charAt(0) + '***' + name.charAt(name.length - 1);
    return `${masked}@${domain}`;
  }

  static isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static isValidPhone(phone) {
    const regex = /^\+?[\d\s-]{10,15}$/;
    return regex.test(phone);
  }

  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static removeNullValues(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    const result = Array.isArray(obj) ? [] : {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        result[key] = typeof value === 'object' ? this.removeNullValues(value) : value;
      }
    }
    return result;
  }
}

module.exports = Helpers;
