import LAYOUT_CONST from 'constant';

// Default path for dashboard landing page
export const DASHBOARD_PATH = '/dashboard/default';

// Maximum number of items to show in horizontal navigation
export const HORIZONTAL_MAX_ITEM = 7;

// Main application configuration object
const config = {
  // Layout type: vertical sidebar or horizontal top nav
  layout: LAYOUT_CONST.HORIZONTAL_LAYOUT, // Options: vertical, horizontal

  // Drawer (sidebar) type: default full drawer or mini-collapsed drawer
  drawerType: LAYOUT_CONST.MINI_DRAWER, // Options: default, mini-drawer

  // Default font stack for the application
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Roboto', sans-serif`,

  // Border radius applied to components
  borderRadius: 8,

  // Whether to use outlined + filled style for inputs/buttons
  outlinedFilled: true,

  // Navigation bar type (theme) – affects header and nav colors
  navType: 'light', // Options: light, dark

  // Preset theme color
  presetColor: 'theme3', // Options: default, theme1, theme2, theme3, theme4, theme5, theme6

  // Default language/locale for the app
  locale: 'en', // Options: 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese

  // Right-to-left layout toggle (useful for Arabic, Hebrew)
  rtlLayout: false,

  // Whether the layout is contained (centered) or full-width
  container: false
};

// Export configuration object for use throughout the app
export default config;
