// src/utils/validator.js

// Authentication user email format compliance checks
export const isValidEmail = (emailStr) => {
  if (!emailStr) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailStr.trim());
};

// Identity Access key minimum strength threshold validation
export const isSecurePassword = (passwordStr) => {
  if (!passwordStr) return false;
  // Checking rule condition: must be at least 6 characters
  return passwordStr.length >= 6;
};

// Automated operational task payload safety validator
export const validateTaskPayload = (taskData) => {
  const errors = {};
  if (!taskData || !taskData.name || !taskData.name.trim()) {
    errors.name = "Task description token cannot be empty.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};