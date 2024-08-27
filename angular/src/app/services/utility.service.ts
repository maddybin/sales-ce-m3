import { Injectable } from '@angular/core';
import { Contact } from '../shared/models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  extractMemberIdentity(url: any, key: string) {
    if (url.split(key).length && url.split(key)[1] && url.split(key)[1].split('/').length) {
      if (url.split(key)[1].split('/')[0] === 'unavailable') {
        return null;
      } else {
        return url.split(key)[1].split('/')[0];
      }
    } else {
      return null;
    }
  }

  formatDate(data: any) {
    let MONTHS_REGX = "\\bJanuary\\b|\\bFebruary\\b|\\bMarch\\b|\\bApril\\b|\\bMay\\b|\\bJune\\b|\\bJuly\\b|\\bAugust\\b|\\bSeptember\\b|\\bOctober\\b|\\bNovember\\b|\\bDecember\\b";
    let MONTHNAMES = [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month_match: any;
    if (data) {
      month_match = data.match(new RegExp(MONTHS_REGX, "i"));
      if (month_match) {
        data = data.replace(/[\sa-zA-Z\u2013\u2014]/g, "") + "-" + MONTHNAMES.indexOf(month_match[0]) + "-01";
      } else {
        data = data.replace(/[\s\u2013\u2014]/g, "") + "-01-01";
      }
    }
    return data;
  };
}
