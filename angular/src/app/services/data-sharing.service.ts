import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  public settingPageSub = new Subject();
  
  constructor() { }
  
  setShowSettingPage(message: boolean) {
    this.settingPageSub.next(message);
  }

  getShowSettingPage(): Observable<any> {
    return this.settingPageSub.asObservable();
  }
}
