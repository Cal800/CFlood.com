// Encryption key (in production, this should be handled more securely)
const ENCRYPTION_KEY = 'your-256-bit-secret-key-here-must-be-32-chars';

// Data storage keys
const USERS_KEY = 'vault_users';
const PASSWORD_BOOKS_KEY = 'vault_password_books';
const CURRENT_USER_KEY = 'vault_current_user';
const SESSION_KEY = 'vault_session';

// Current state
let currentUser = null;
let currentBookId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Check if user is logged in
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) {
    currentUser = JSON.parse(session);
    navigateTo('dashboard');
  } else {
    navigateTo('welcome');
  }

  // Setup event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Sign up form
  document.getElementById('signup-form').addEventListener('submit', handleSignUp);
  
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  // Create book form
  document.getElementById('create-book-form').addEventListener('submit', handleCreateBook);
  
  // Password validation
  document.getElementById('masterPassword').addEventListener('input', validatePasswordRequirements);
  
  // Note character count
  document.getElementById('bookNote').addEventListener('input', updateNoteCharCount);
}

// Navigation
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  
  // Show requested page
  const pageElement = document.getElementById(`${page}-page`);
  if (pageElement) {
    pageElement.style.display = 'block';
  }
  
  // Page-specific initialization
  if (page === 'dashboard') {
    loadDashboard();
  } else if (page === 'login-success') {
    // Auto-redirect after 3 seconds
    setTimeout(() => navigateTo('dashboard'), 3000);
  } else if (page === 'login') {
    // Clear login form to prevent autofill
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    // Clear again after a short delay to catch browser autofill
    setTimeout(() => {
      document.getElementById('login-username').value = '';
      document.getElementById('login-password').value = '';
    }, 100);
  }
}

// Encryption functions
function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
}

function decryptPassword(encryptedPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// User management
function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getUserByUsername(username) {
  const users = getUsers();
  return users.find(u => u.username === username);
}

// Password books management
function getPasswordBooks() {
  const books = localStorage.getItem(PASSWORD_BOOKS_KEY);
  return books ? JSON.parse(books) : [];
}

function savePasswordBooks(books) {
  localStorage.setItem(PASSWORD_BOOKS_KEY, JSON.stringify(books));
}

function getUserPasswordBooks(userId) {
  const books = getPasswordBooks();
  return books.filter(b => b.userId === userId);
}

// Sign up handler
function handleSignUp(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const masterPassword = document.getElementById('masterPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Clear previous errors
  clearErrors();
  
  // Validate
  const errors = validateSignUpForm(username, masterPassword, confirmPassword);
  
  if (Object.keys(errors).length > 0) {
    displayErrors(errors);
    return;
  }
  
  // Check if user already exists
  const existingUser = getUserByUsername(username);
  if (existingUser) {
    displayError('username-error', 'An account with this username already exists');
    return;
  }
  
  // Create user
  const users = getUsers();
  const newUser = {
    id: Date.now(),
    username,
    encryptedPassword: encryptPassword(masterPassword),
    firstLogin: true,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  alert('Account created successfully! Please log in.');
  navigateTo('login');
  
  // Reset form
  document.getElementById('signup-form').reset();
  resetPasswordRequirements();
}

function validateSignUpForm(username, masterPassword, confirmPassword) {
  const errors = {};
  
  // Username validation
  if (!username) {
    errors.username = 'Username is required';
  } else if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }
  
  // Password validation
  const passwordError = validatePassword(masterPassword);
  if (passwordError) {
    errors.masterPassword = passwordError;
  }
  
  // Confirm password
  if (masterPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
}

function validatePassword(password) {
  if (password.length < 9) {
    return 'Password must be at least 9 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one capital letter';
  }
  if (!/[0-9]/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one number OR special character';
  }
  return null;
}

function validatePasswordRequirements() {
  const password = document.getElementById('masterPassword').value;
  
  const lengthReq = document.getElementById('req-length');
  const capitalReq = document.getElementById('req-capital');
  const numberReq = document.getElementById('req-number');
  
  if (password.length >= 9) {
    lengthReq.classList.add('valid');
  } else {
    lengthReq.classList.remove('valid');
  }
  
  if (/[A-Z]/.test(password)) {
    capitalReq.classList.add('valid');
  } else {
    capitalReq.classList.remove('valid');
  }
  
  if (/[0-9]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    numberReq.classList.add('valid');
  } else {
    numberReq.classList.remove('valid');
  }
}

function resetPasswordRequirements() {
  document.getElementById('req-length').classList.remove('valid');
  document.getElementById('req-capital').classList.remove('valid');
  document.getElementById('req-number').classList.remove('valid');
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = 'Hide';
  } else {
    input.type = 'password';
    button.textContent = 'Show';
  }
}

function displayErrors(errors) {
  for (const [field, message] of Object.entries(errors)) {
    displayError(`${field}-error`, message);
  }
}

function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// Login handler
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const masterPassword = document.getElementById('login-password').value;
  
  clearErrors();
  
  if (!username || !masterPassword) {
    displayError('login-error', 'Username and password are required');
    return;
  }
  
  const user = getUserByUsername(username);
  
  if (!user) {
    displayError('login-error', 'Invalid credentials');
    return;
  }
  
  // Decrypt and compare passwords
  const decryptedPassword = decryptPassword(user.encryptedPassword);
  
  if (decryptedPassword !== masterPassword) {
    displayError('login-error', 'Invalid credentials');
    return;
  }
  
  // Check if first login
  const isFirstLogin = user.firstLogin === true || user.firstLogin === null || user.firstLogin === undefined;
  
  if (isFirstLogin) {
    // Update first_login flag
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].firstLogin = false;
      saveUsers(users);
    }
  }
  
  // Set current user
  currentUser = {
    id: user.id,
    username: user.username
  };
  
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  
  // Go directly to dashboard
  navigateTo('dashboard');
}

// Logout
function logout() {
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  navigateTo('welcome');
}

// Dashboard functions
function loadDashboard() {
  if (!currentUser) {
    navigateTo('login');
    return;
  }
  
  const books = getUserPasswordBooks(currentUser.id);
  const content = document.getElementById('dashboard-content');
  
  if (books.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="25" width="40" height="45" rx="4" fill="#4A90E2" fillOpacity="0.2"/>
            <rect x="20" y="25" width="40" height="45" rx="4" stroke="#4A90E2" strokeWidth="2"/>
            <path d="M30 40H50M30 48H50M30 56H45" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2>Create Your First Password Book</h2>
        <p>Start organizing your passwords by creating your first password book. Think of it as a secure folder for related passwords.</p>
        <button class="create-first-book-button" onclick="showCreateBookModal()">
          Create Your First Password Book
        </button>
      </div>
    `;
    document.getElementById('floating-add-button').style.display = 'none';
  } else {
    content.innerHTML = `
      <div class="password-books-container">
        <div class="search-bar">
          <input type="text" id="search-input" class="search-input" placeholder="Search password books..." oninput="filterBooks(this.value)">
        </div>
        <div class="books-grid" id="books-grid">
          ${books.map(book => createBookCard(book)).join('')}
        </div>
      </div>
    `;
    document.getElementById('floating-add-button').style.display = 'flex';
  }
}

function createBookCard(book) {
  return `
    <div class="book-card-simple" onclick="viewBook(${book.id})">
      <div class="book-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="20" height="16" rx="2" fill="#4A90E2" fillOpacity="0.2"/>
          <rect x="6" y="8" width="20" height="16" rx="2" stroke="#4A90E2" strokeWidth="2"/>
          <path d="M10 16H22M10 20H18" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3>${escapeHtml(book.name)}</h3>
    </div>
  `;
}

function filterBooks(query) {
  const books = getUserPasswordBooks(currentUser.id);
  const filtered = books.filter(book => 
    book.name.toLowerCase().includes(query.toLowerCase())
  );
  
  const grid = document.getElementById('books-grid');
  grid.innerHTML = filtered.map(book => createBookCard(book)).join('');
}

function showCreateBookModal() {
  document.getElementById('create-book-modal').style.display = 'flex';
  document.getElementById('bookName').focus();
}

function hideCreateBookModal() {
  document.getElementById('create-book-modal').style.display = 'none';
  document.getElementById('create-book-form').reset();
  document.getElementById('note-char-count').textContent = '0';
}

function handleCreateBook(e) {
  e.preventDefault();
  
  const name = document.getElementById('bookName').value.trim();
  const password = document.getElementById('bookPassword').value;
  const note = document.getElementById('bookNote').value.trim();
  
  if (!name) {
    alert('Book name is required');
    return;
  }
  
  const books = getPasswordBooks();
  const newBook = {
    id: Date.now(),
    userId: currentUser.id,
    name,
    encryptedPassword: password ? encryptPassword(password) : null,
    note,
    createdAt: new Date().toISOString()
  };
  
  books.push(newBook);
  savePasswordBooks(books);
  
  hideCreateBookModal();
  loadDashboard();
}

function updateNoteCharCount() {
  const note = document.getElementById('bookNote').value;
  document.getElementById('note-char-count').textContent = note.length;
}

// Book detail functions
function viewBook(bookId) {
  currentBookId = bookId;
  const books = getUserPasswordBooks(currentUser.id);
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    navigateTo('dashboard');
    return;
  }
  
  const content = document.getElementById('book-detail-content');
  const password = book.encryptedPassword ? decryptPassword(book.encryptedPassword) : '';
  
  content.innerHTML = `
    <div class="book-view">
      <div class="book-info">
        <div class="book-header">
          <h2>${escapeHtml(book.name)}</h2>
          <div class="book-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="20" height="16" rx="2" fill="#4A90E2" fillOpacity="0.2"/>
              <rect x="6" y="8" width="20" height="16" rx="2" stroke="#4A90E2" strokeWidth="2"/>
              <path d="M10 16H22M10 20H18" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div class="book-details">
          <div class="password-section">
            <label>Password</label>
            <div class="password-input-group">
              <input
                type="text"
                value="${escapeHtml(password)}"
                readonly
                class="password-display"
                placeholder="No password set"
              />
              <button class="copy-button" onclick="copyPassword('${escapeHtml(password)}')" ${!password ? 'disabled' : ''}>
                Copy
              </button>
            </div>
          </div>

          <div class="note-section">
            <label>Note</label>
            <textarea
              readonly
              class="note-display"
              placeholder="No note added"
              rows="3"
            >${escapeHtml(book.note || '')}</textarea>
          </div>

          <div class="book-meta">
            <small>Created ${new Date(book.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      </div>

      <div class="book-actions">
        <button class="delete-button" onclick="showDeleteConfirmModal()">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4V3C6 2.44772 6.44772 2 7 2H13C13.5523 2 14 2.44772 14 3V4M6 4H14M6 4H4M14 4H16M7 7V13M13 7V13M5 4V16C5 16.5523 5.44772 17 6 17H14C14.5523 17 15 16.5523 15 16V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete This Book
        </button>
        
        <button class="edit-button" onclick="showEditBookForm()">
          Edit Book
        </button>
      </div>
    </div>
  `;
  
  navigateTo('book-detail');
}

function copyPassword(password) {
  navigator.clipboard.writeText(password).then(() => {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function showEditBookForm() {
  const books = getUserPasswordBooks(currentUser.id);
  const book = books.find(b => b.id === currentBookId);
  
  if (!book) return;
  
  const password = book.encryptedPassword ? decryptPassword(book.encryptedPassword) : '';
  
  const content = document.getElementById('book-detail-content');
  content.innerHTML = `
    <div class="edit-book-form">
      <h2>Edit Book</h2>
      <form id="edit-book-form" class="modal-form">
        <div class="form-group">
          <label for="edit-bookName">Book Name *</label>
          <input type="text" id="edit-bookName" value="${escapeHtml(book.name)}" required />
        </div>
        <div class="form-group">
          <label for="edit-bookPassword">Password</label>
          <input type="password" id="edit-bookPassword" value="${escapeHtml(password)}" />
        </div>
        <div class="form-group">
          <label for="edit-bookNote">Note (200 chars max)</label>
          <textarea id="edit-bookNote" rows="3">${escapeHtml(book.note || '')}</textarea>
          <div class="char-count"><span id="edit-note-char-count">${(book.note || '').length}</span>/200</div>
        </div>
        <div class="modal-actions">
          <button type="button" class="cancel-button" onclick="viewBook(${currentBookId})">Cancel</button>
          <button type="submit" class="create-button">Confirm Changes</button>
        </div>
      </form>
    </div>
  `;
  
  // Setup event listeners for edit form
  document.getElementById('edit-book-form').addEventListener('submit', handleEditBook);
  document.getElementById('edit-bookNote').addEventListener('input', (e) => {
    document.getElementById('edit-note-char-count').textContent = e.target.value.length;
  });
}

function handleEditBook(e) {
  e.preventDefault();
  
  const name = document.getElementById('edit-bookName').value.trim();
  const password = document.getElementById('edit-bookPassword').value;
  const note = document.getElementById('edit-bookNote').value.trim();
  
  if (!name) {
    alert('Book name is required');
    return;
  }
  
  const books = getPasswordBooks();
  const bookIndex = books.findIndex(b => b.id === currentBookId);
  
  if (bookIndex !== -1) {
    books[bookIndex].name = name;
    books[bookIndex].encryptedPassword = password ? encryptPassword(password) : null;
    books[bookIndex].note = note;
    savePasswordBooks(books);
  }
  
  viewBook(currentBookId);
}

function showDeleteConfirmModal() {
  document.getElementById('delete-confirm-modal').style.display = 'flex';
  document.getElementById('confirm-delete-button').onclick = deleteBook;
}

function hideDeleteConfirmModal() {
  document.getElementById('delete-confirm-modal').style.display = 'none';
}

function deleteBook() {
  const books = getPasswordBooks();
  const filteredBooks = books.filter(b => b.id !== currentBookId);
  savePasswordBooks(filteredBooks);
  
  hideDeleteConfirmModal();
  navigateTo('dashboard');
}

// Utility functions
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}