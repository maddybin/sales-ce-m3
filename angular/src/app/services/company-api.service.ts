import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from '../shared/constants/endpoints';
import { RequestService } from './request.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {

  globalApiKey: any;
  constructor(private requestService: RequestService, private storageService: StorageService) {
    this.globalApiKey = this.storageService.get('loggedInUser').api_key;
  }

  checkCompanyExistents(payload: any, watchlistId: any): Observable<any> {
    let globalCompanyUrl = `${ApiUrl.backendUriv0}/${ApiUrl.companyExist}&api_key=${this.globalApiKey}&watchlist_id=${watchlistId}`;
    return this.requestService.post(globalCompanyUrl, payload);
  }

  saveCompanyProfileToDs(payload: any): Observable<any> {
    var SaveUrl = `${ApiUrl.backendUriv0}/${ApiUrl.companyImport}?api_key=${this.globalApiKey}`;
    return this.requestService.post(SaveUrl, payload);
  }

  makeCompanyRefreshRequest(payload: any, watchlistId: any): Observable<any> {
    var companyRefreshUrl = `${ApiUrl.backendUriv1}/${ApiUrl.companyRefreshRequest}?api_key=${this.globalApiKey}&watchlist_id=${watchlistId}`;
    return this.requestService.post(companyRefreshUrl, payload);
  }

  addToWatchlist(payload: any, watchListId: any) {
    let watchListUrl = `${ApiUrl.backendUriv0}/${ApiUrl.companyWatchlist}/${watchListId}?api_key=${this.globalApiKey}`;
    return this.requestService.patch(watchListUrl, payload);
  }
}
