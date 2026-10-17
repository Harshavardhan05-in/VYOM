/**
 * PhishShield AI — Google Apps Script Properties Setup Utility
 * 
 * Run this function once in the Google Apps Script editor (`setupPhishShieldProperties`)
 * to initialize or update your environment configuration.
 * 
 * Script Properties are securely stored in the Google Cloud Project backing this
 * script and are not exposed in the client-side add-on manifest.
 */

function setupPhishShieldProperties() {
  var props = PropertiesService.getScriptProperties();

  // Configure your target deployment URLs and shared integration key
  var configuration = {
    // Backend API base URL (Default: deployed Render backend)
    "PHISHSHIELD_BACKEND_URL": "https://phishshield-ai.onrender.com",

    // Optional integration API key (Matches GMAIL_INTEGRATION_API_KEY in backend .env)
    // Leave empty ("") if backend integration authentication is not enabled.
    "PHISHSHIELD_API_KEY": "",

    // Web dashboard base URL for full report view links
    "PHISHSHIELD_DASHBOARD_URL": "https://phish-shield-ai-pink.vercel.app"
  };

  props.setProperties(configuration);
  Logger.log("✅ PhishShield AI Script Properties successfully configured:");
  Logger.log("   - PHISHSHIELD_BACKEND_URL: " + configuration.PHISHSHIELD_BACKEND_URL);
  Logger.log("   - PHISHSHIELD_API_KEY: " + (configuration.PHISHSHIELD_API_KEY ? "[CONFIGURED]" : "[NOT SET - PUBLIC ACCESS]"));
  Logger.log("   - PHISHSHIELD_DASHBOARD_URL: " + configuration.PHISHSHIELD_DASHBOARD_URL);
}

/**
 * Inspection utility to view current script properties (without exposing full secrets).
 */
function inspectPhishShieldProperties() {
  var props = PropertiesService.getScriptProperties();
  var all = props.getProperties();
  Logger.log("Current Script Properties:");
  for (var key in all) {
    if (key.indexOf("KEY") !== -1 || key.indexOf("SECRET") !== -1) {
      Logger.log("  " + key + " = " + (all[key] ? all[key].substring(0, 4) + "... (redacted)" : "(empty)"));
    } else {
      Logger.log("  " + key + " = " + all[key]);
    }
  }
}
