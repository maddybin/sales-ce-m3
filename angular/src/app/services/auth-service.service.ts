import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from '../shared/constants/endpoints';
import { RequestService } from './request.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private requestService: RequestService) { }

  login(user: any): Observable<any> {
    return this.requestService.post(`${ApiUrl.backendUriv0}/${ApiUrl.authUrl}`, { user });
  }

  isUserLogged() {
    return localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')) : false;
  }

  logOutUser() {
    return localStorage.removeItem('loggedInUser');
  }

}
