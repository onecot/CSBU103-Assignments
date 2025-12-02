/**
 * Authentication Form Validation
 * Contains validation functions for login and registration forms
 */

$(document).ready(function() {
  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{6,}$/;

  /**
   * Validate email format
   * @param {string} email - Email string to validate
   * @returns {boolean} - True if valid email format
   */
  function validateEmail(email) {
    return emailRegex.test(email);
  }

  /**
   * Validate password complexity
   * Must be at least 6 characters, contain at least 1 number and 1 special character
   * @param {string} password - Password string to validate
   * @returns {boolean} - True if valid password
   */
  function validatePassword(password) {
    return passwordRegex.test(password);
  }

  /**
   * Check if passwords match
   * @param {string} password - First password
   * @param {string} confirmPassword - Confirmation password
   * @returns {boolean} - True if passwords match
   */
  function passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  /**
   * Show validation error message
   * @param {string} message - Error message to display
   */
  function showValidationError(message) {
    $('#validationError').text(message).show();
  }

  /**
   * Hide validation error message
   */
  function hideValidationError() {
    $('#validationError').hide();
  }

  // Login form validation
  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    hideValidationError();

    const username = $('#username').val().trim();

    // Email format validation
    if (!validateEmail(username)) {
      showValidationError('Username must be a valid email address.');
      return false;
    }

    // If validation passes, submit the form
    this.submit();
  });

  // Register form validation
  $('#registerForm').on('submit', function(e) {
    e.preventDefault();
    hideValidationError();

    const username = $('#username').val().trim();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();

    // Email format validation (username should be an email)
    if (!validateEmail(username)) {
      showValidationError('Username must be a valid email address.');
      return false;
    }

    // Password complexity validation
    if (!validatePassword(password)) {
      showValidationError('Password must be at least 6 characters and contain at least 1 number and 1 special character.');
      return false;
    }

    // Passwords must match
    if (!passwordsMatch(password, confirmPassword)) {
      showValidationError('The passwords you entered do not match.');
      return false;
    }

    // If all validations pass, submit the form
    this.submit();
  });
});
