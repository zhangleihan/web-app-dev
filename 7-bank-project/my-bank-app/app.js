// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const serverUrl = 'http://localhost:5001/api';
const storageKey = 'savedAccount';

const routes = {
    '/dashboard': { title: 'My Account', templateId: 'dashboard', init: refresh },
    '/login': { title: 'Login', templateId: 'login' }
  };
  
  function navigate(path) {
    window.history.pushState({}, path, window.location.origin + path);
    updateRoute();
  }
  
  function updateRoute() {
    const path = window.location.pathname;
    const route = routes[path];
  
    if (!route) {
      return navigate('/dashboard');
    }
  
    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(view);
    
    if (typeof route.init === 'function') {
      route.init();
    }
  
    document.title = route.title;
  }

  async function refresh() {
    await updateAccountData();
    updateDashboard();
  }
  
  // ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------

let state = Object.freeze({
    account: null
  });
  
  function updateState(property, newData) {
    state = Object.freeze({
      ...state,
      [property]: newData
    });
    localStorage.setItem(storageKey, JSON.stringify(state.account));
  }
  
  // ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

function init() {
    // Restore state
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      updateState('account', JSON.parse(savedState));
    }
  
    // Update route for browser back/next buttons
    window.onpopstate = () => updateRoute();
    updateRoute();
  }
  
init();