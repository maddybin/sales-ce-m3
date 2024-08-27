import { environment } from "src/environments/environment";

/**
 * For API Requests
 */
export class ApiUrl {
  // Base URLs
  static backendUrlV0 = `${environment.baseURL}`;
  static backendUrlV1 = `${environment.baseURLV1}`;
  static baseAppUrl = `${environment.baseAppUrl}`;
  static contactExist = 'linkedin_contacts/global_contact?contact_source=sales_ce';
  static contactWatchlistListing = 'contact_watchlists/ce_listing';
  static companyWatchlistListing = 'company_watchlists/ce_listing';
  static contactWatchlistShared = 'contact_shared_lists/ce_listing';
  static contactImport = 'linkedin_contacts/import';
  static authUrl = 'auth/sign_in';
  static contactWatchlist = 'contact_watchlists';
  static companyWatchlist = 'company_watchlists';
  static contactRefreshRequest = 'contact_profile_refresh_requests';
  static companyExist = 'linkedin_companies/global_company?company_source=sales_ce';
  static companyImport = 'linkedin_companies/import';
  static companyRefreshRequest = 'account_profile_refresh_requests';
}
