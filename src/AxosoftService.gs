/** 
 * Axosoft API
 * @license MIT License
 * @author Rutger Meekers
 *
 */
 
/**
 * This script uses the OAUTH2 library: https://github.com/googlesamples/apps-script-oauth2
 * Make sure you include the library (MswhXl8fVhTFUH_Q3UOJbXvxhMjh3Sh48) in your project under Resources > Libraries.
 */

/**
 * Settings
 * See http://developer.axosoft.com/authentication/authorization-code.html for more information.
 */
// Axosoft Client ID
var CLIENT_ID = '';
// Axosoft Client Secret
var CLIENT_SECRET = '';
// Axosoft Base Authorization URL
var AUTHORIZATION_BASE_URL = 'https://your_implementation.axosoft.com/auth';
// Axosoft Token URL
var TOKEN_URL = 'https://your_implementation.axosoft.com/api/oauth2/token';
// Axosoft Authorization Scope
var SERVICE_SCOPE = 'read';

/**
 * Check OAUTH2 authorization.
 */
function authorizationStatus() {
  var service = getService();
  if (service.hasAccess()) {
    // Output for debugging purposes
    /*
    var url = 'https://your_implementation.axosoft.com/api/v5/me';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    */
    
    return true;
    
  } else {
    showAuthorizationUrl();
  }
}

/**
 * Shows the authorization URL in a dialog.
 */
function showAuthorizationUrl() {
  var ui = SpreadsheetApp.getUi();
  var service = getService();
  
  var authorizationUrl = service.getAuthorizationUrl();
  ui.alert('Open the following URL and re-run the script: ' + authorizationUrl);
  
  // Output for debugging purposes
  //Logger.log('Open the following URL and re-run the script: %s',authorizationUrl);
}

/**
 * Creates a new service connection
 */
function getService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('axosoft')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl(AUTHORIZATION_BASE_URL)
      .setTokenUrl(TOKEN_URL)

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope(SERVICE_SCOPE)
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  var service = getService();
  service.reset();
}
