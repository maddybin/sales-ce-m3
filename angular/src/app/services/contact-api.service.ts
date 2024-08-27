import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from '../shared/constants/endpoints';
import { RequestService } from './request.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class ContactApiService {
  globalApiKey: any;
  
  constructor(private requestService: RequestService, private storageService: StorageService) {
    this.globalApiKey = this.storageService.get('loggedInUser').api_key;
  }

  checkContactExistents(payload: any, watchlistId: any): Observable<any> {
    return this.requestService.post(`${ApiUrl.backendUriv0}/${ApiUrl.contactExist}&api_key=${this.globalApiKey}&watchlist_id=${watchlistId}`, payload);
  }

  bringWatchlists(isContact: boolean = false): Observable<any> {
    let identifier = isContact ? ApiUrl.contactWatchlistListing : ApiUrl.companyWatchlistListing;
    return this.requestService.get(`${ApiUrl.backendUriv0}/${identifier}?api_key=${this.globalApiKey}`);
  }

  saveContactProfileToDs(payload: any): Observable<any> {
    var SaveUrl = `${ApiUrl.backendUriv0}/${ApiUrl.contactImport}?api_key=${this.globalApiKey}`;
    return this.requestService.post(SaveUrl, payload);
  }

  pushWatchlist(payload: any, watchListId: any) {
    var watchListUrl = `${ApiUrl.backendUriv0}/${ApiUrl.contactWatchlist}/${watchListId}?api_key=${this.globalApiKey}`;
    return this.requestService.patch(watchListUrl, payload);
  }

  makeContactRefreshRequest(payload: any, watchlistId: any) {
    let contactRefreshUrl = `${ApiUrl.backendUriv1}/${ApiUrl.contactRefreshRequest}?api_key=${this.globalApiKey}&contact_watchlist_id=${watchlistId}`;
    return this.requestService.post(contactRefreshUrl, payload);
  }

  createWatchList(payload: any, isContact: boolean = false): Observable<any> {
    let identifier = isContact ? ApiUrl.contactWatchlist : ApiUrl.companyWatchlist;

    let createWatchListUrl = `${ApiUrl.backendUriv0}/${identifier}?api_key=${this.globalApiKey}`;
    return this.requestService.post(createWatchListUrl, payload);
  }
}
