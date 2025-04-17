class AuthManager {
  static async checkAuth() {
      try {
          const response = await fetch('../php/check_session.php');
          return await response.json();
      } catch (error) {
          console.error('Auth check failed:', error);
          return { logged_in: false };
      }
  }

  static async login(formData) {
      const response = await fetch('../php/login.php', {
          method: 'POST',
          body: formData
      });
      return await response.json();
  }

  static async logout() {
      await fetch('../php/logout.php');
  }

  static updateUI(authState) {
      const loginButtons = document.querySelectorAll('.login-trigger');
      const signupButtons = document.querySelectorAll('[href="signup.html"]');
      const logoutButton = document.getElementById('logoutButton');
      const logoutButtonMobile = document.getElementById('logoutButtonMobile');
      const protectedLinks = document.querySelectorAll('[href="dashboard.html"], [href="settings.html"], [href="completed.html"]');

      if (authState.logged_in) {
          logoutButton?.classList.remove('hidden');
          logoutButtonMobile?.classList.remove('hidden');
          loginButtons.forEach(btn => btn.classList.add('hidden'));
          signupButtons.forEach(btn => btn.classList.add('hidden'));
          protectedLinks.forEach(link => link.classList.remove('hidden'));
      } else {
          logoutButton?.classList.add('hidden');
          logoutButtonMobile?.classList.add('hidden');
          loginButtons.forEach(btn => btn.classList.remove('hidden'));
          signupButtons.forEach(btn => btn.classList.remove('hidden'));
          protectedLinks.forEach(link => link.classList.add('hidden'));
      }
  }
}
document.addEventListener('DOMContentLoaded', async function() {
  const authState = await AuthManager.checkAuth();
  AuthManager.updateUI(authState);

  const showSignupBtn = document.getElementById('showSignup');
  const showLoginBtn = document.getElementById('showLogin');
  const loginView = document.getElementById('loginView');
  const signupView = document.getElementById('signupView');
  
  showSignupBtn?.addEventListener('click', function() {
    loginView.classList.add('hidden');
    signupView.classList.remove('hidden');
    document.getElementById('loginError').classList.add('hidden');
  });

  showLoginBtn?.addEventListener('click', function() {
    signupView.classList.add('hidden');
    loginView.classList.remove('hidden');
    document.getElementById('signupError').classList.add('hidden');
  });
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitButton = signupForm.querySelector('button[type="submit"]');
      const errorDisplay = document.getElementById('signupError');
      const formData = new FormData(signupForm);
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Signing up...';
      errorDisplay.classList.add('hidden');
      
      try {
        const response = await fetch('../php/signup.php', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          const loginResponse = await fetch('../php/login.php', {
            method: 'POST',
            body: formData
          });
          
          const loginResult = await loginResponse.json();
          
          if (loginResult.success) {
            loginOverlay.classList.add('hidden');
            loginOverlay.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');

            const authState = await AuthManager.checkAuth();
            AuthManager.updateUI(authState);
            window.location.href = 'dashboard.html';
          } else {
            errorDisplay.textContent = 'Account created! Please log in.';
            errorDisplay.classList.remove('hidden');
            signupView.classList.add('hidden');
            loginView.classList.remove('hidden');
          }
        } else {
          errorDisplay.textContent = result.message || 'Signup failed';
          errorDisplay.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Signup error:', error);
        errorDisplay.textContent = 'An error occurred. Please try again.';
        errorDisplay.classList.remove('hidden');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
      }
    });
  }

  document.querySelector('.fa-bars')?.parentElement?.addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
          mobileMenu.classList.toggle('hidden');
      }
  });

  const loginOverlay = document.getElementById('loginOverlay');
  const closeLogin = document.getElementById('closeLogin');
  const loginForm = document.getElementById('loginForm');

  document.querySelectorAll('.login-trigger').forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          if (loginOverlay) {
              loginOverlay.classList.remove('hidden');
              loginOverlay.classList.add('flex');
              document.body.classList.add('overflow-hidden');
          }
      });
  });

  if (closeLogin) {
      closeLogin.addEventListener('click', () => {
          if (loginOverlay) {
              loginOverlay.classList.add('hidden');
              loginOverlay.classList.remove('flex');
              document.body.classList.remove('overflow-hidden');
          }
      });
  }

  loginOverlay?.addEventListener('click', (e) => {
      if (e.target === loginOverlay) {
          loginOverlay.classList.add('hidden');
          loginOverlay.classList.remove('flex');
          document.body.classList.remove('overflow-hidden');
      }
  });

  loginForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const formData = new FormData(loginForm);
      
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';

      try {
          const result = await AuthManager.login(formData);
          
          if (result.success) {
              loginOverlay.classList.add('hidden');
              loginOverlay.classList.remove('flex');
              document.body.classList.remove('overflow-hidden');
              
              // Update UI and redirect
              const authState = await AuthManager.checkAuth();
              AuthManager.updateUI(authState);
              window.location.href = 'dashboard.html';
          } else {
              alert(result.message || 'Login failed');
          }
      } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred during login');
      } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Log In';
      }
  });

  document.getElementById('logoutButton')?.addEventListener('click', async () => {
      await AuthManager.logout();
      const authState = await AuthManager.checkAuth();
      AuthManager.updateUI(authState);
      window.location.href = 'index.html';
  });

  document.getElementById('logoutButtonMobile')?.addEventListener('click', async () => {
      await AuthManager.logout();
      const authState = await AuthManager.checkAuth();
      AuthManager.updateUI(authState);
      window.location.href = 'index.html';
  });
});

if (window.location.pathname.includes('dashboard.html') || 
  window.location.pathname.includes('settings.html')) {
  AuthManager.checkAuth().then(authState => {
      if (!authState.logged_in) {
          window.location.href = 'index.html';
      }
  });
}