import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyUtilityService {

  constructor(private storageService: StorageService) { }

  formatCompanyResponse(payload: any) {
    return payload;
  }

  buildCompanyRefreshRequestAttr() {
    let isWebTechnologies = this.storageService.get('webTechnologies');
    let isFundingAndFinancial = this.storageService.get('fundAndFinancial');
    let isLeadership = this.storageService.get('leadership');

    let params = [];

    if (isWebTechnologies) { params.push({ name: 'web_technologies', priority_order: 1 }) }
    if (isFundingAndFinancial) {
      params.push({ name: 'funding', priority_order: 2 })
      params.push({ name: 'financials', priority_order: 3 })
    }
    if (isLeadership) { params.push({ name: 'company_leadership', priority_order: 4 }) }

    return params;
  }
}
