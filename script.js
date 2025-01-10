// Password strength checker
function checkPasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Return strength level and description
    if (score <= 2) return { level: 'weak', width: '25%' };
    if (score <= 3) return { level: 'fair', width: '50%' };
    if (score <= 4) return { level: 'good', width: '75%' };
    return { level: 'strong', width: '100%' };
  }
  
  // Utility functions
  function generatePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    return Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map(x => charset[x % charset.length])
      .join('');
  }
  
  function encryptData(data) {
    return btoa(JSON.stringify(data));
  }
  
  function decryptData(encryptedData) {
    return JSON.parse(atob(encryptedData));
  }
  
  // DOM Elements
  const passwordForm = document.getElementById('passwordForm');
  const generateBtn = document.getElementById('generateBtn');
  const passwordList = document.getElementById('passwordList');
  const passwordInput = document.getElementById('password');
  
  // Add password strength meter to password input
  const strengthMeterHtml = `
    <div class="password-strength">
      <div class="strength-meter">
        <div class="strength-meter-fill"></div>
      </div>
      <div class="strength-text"></div>
    </div>
  `;
  
  passwordInput.insertAdjacentHTML('afterend', strengthMeterHtml);
  const strengthMeterFill = document.querySelector('.strength-meter-fill');
  const strengthText = document.querySelector('.strength-text');
  
  // Update password strength meter
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    
    strengthMeterFill.className = 'strength-meter-fill ' + strength.level;
    strengthMeterFill.style.width = strength.width;
    strengthText.textContent = password.length > 0 ? 
      `Password strength: ${strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}` : '';
  });
  
  // State management
  let passwords = (() => {
    const savedPasswords = localStorage.getItem('passwords');
    if (savedPasswords) {
      try {
        return decryptData(savedPasswords);
      } catch (error) {
        console.error('Error loading passwords:', error);
        return [];
      }
    }
    return [];
  })();
  
  // Event Handlers
  generateBtn.addEventListener('click', () => {
    const password = generatePassword();
    passwordInput.value = password;
    // Trigger input event to update strength meter
    passwordInput.dispatchEvent(new Event('input'));
  });
  
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newPassword = {
      id: crypto.randomUUID(),
      title: document.getElementById('title').value,
      username: document.getElementById('username').value,
      password: passwordInput.value,
      website: document.getElementById('website').value,
      createdAt: new Date().toISOString()
    };
  
    passwords = [...passwords, newPassword];
    savePasswords();
    renderPasswords();
    passwordForm.reset();
    // Reset strength meter
    strengthMeterFill.style.width = '0';
    strengthText.textContent = '';
  });
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }
  
  function deletePassword(id) {
    passwords = passwords.filter(p => p.id !== id);
    savePasswords();
    renderPasswords();
  }
  
  function savePasswords() {
    localStorage.setItem('passwords', encryptData(passwords));
  }
  
  function renderPasswords() {
    passwordList.innerHTML = passwords.map(entry => `
      <div class="password-item">
        <div class="password-item-header">
          <span class="password-item-title">${entry.title}</span>
          <button class="delete-btn" onclick="deletePassword('${entry.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
        <div class="password-item-content">
          <div class="password-item-row">
            <span class="password-item-label">Username</span>
            <div class="password-item-value">
              <span>${entry.username}</span>
              <button class="copy-btn" onclick="copyToClipboard('${entry.username}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </div>
          <div class="password-item-row">
            <span class="password-item-label">Password</span>
            <div class="password-item-value">
              <span>•••••••••</span>
              <button class="copy-btn" onclick="copyToClipboard('${entry.password}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </div>
          ${entry.website ? `
            <div class="password-item-row">
              <span class="password-item-label">Website</span>
              <a href="${entry.website}" target="_blank" rel="noopener noreferrer" class="website-link">
                Visit
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  
  // Initial render
  renderPasswords();