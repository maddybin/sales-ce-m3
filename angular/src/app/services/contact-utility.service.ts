import { Injectable } from '@angular/core';
import { Contact } from '../shared/models/contact.model';
import { RefreshStatus } from '../shared/models/refresh-status.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUtilityService {

  constructor(private storageService: StorageService) { }

  formatContactResponse(parsed: any): Contact {
    let commonProfile: Contact = new Contact();
    commonProfile.headline = parsed.basic_info[0].headline || '';
    commonProfile.logo_url = parsed.basic_info[0].image_url || '';
    commonProfile.location = parsed.basic_info[0].location || '';
    commonProfile.name = parsed.basic_info[0].name;
    commonProfile.linkedin_url = parsed.linkedin_url;
    return commonProfile;
  }

  selectedCurrentPosition(profile: Contact, selectedWatchlistId: any) {
    // TODO
    // For now displaying single current position only.
    // Update this logic when we add support for multiple current position. 
    let position: any;
    position = profile.current_position ? profile.current_position : null;
    return position;
  }

  getInfoRefreshStatus(data: any, type: any) {
    let className = '';
    let process_status = null;
    if (data.running_process_status === 'not_started' || data.running_process_status == 'in_progress') {
      className = 'verifying-data';
      process_status = 'Verifying';
    } else {
      if (data[type] && data.is_fresh) {
        className = 'verified-data';
        process_status = 'Verified';
      } else if (data[type] && !data.is_fresh) {
        className = 'outdated-data';
        process_status = 'Outdated';
      } else if (data.running_process_status === "completed" && !data[type]) {
        className = 'no-data';
        process_status = 'No Data';
      }
    }

    let param = {
      class_name: className, process_status: process_status, value: data[type],
      last_updated: this.formatVerifiedDate(data, type)
    }

    return param;
  }

  buildContactRefreshStatus(profile: any, selectedPosition: any) {
    let status: RefreshStatus = new RefreshStatus;
    if (profile && selectedPosition) {
      status.work_email = this.getInfoRefreshStatus(selectedPosition.work_email_data, 'email');
      status.corp_phone = this.getInfoRefreshStatus(selectedPosition.corporate_phone_data, 'corporate_phone');
      status.direct_phone = this.getInfoRefreshStatus(selectedPosition.direct_phone_data, 'direct_phone');
      status.mobile_phone = this.getInfoRefreshStatus(selectedPosition.mobile_number_data, 'mobile_number');
      status.personal_email = this.getInfoRefreshStatus(profile.personal_email_data, 'personal_email');
    } else {
      status.work_email = status.corp_phone = status.direct_phone = status.mobile_phone = status.personal_email = '';
    }
    return status;
  }

  formatVerifiedDate(data: any, type: any) {
    let verifiedDate = null;
    switch (type) {
      case 'email':
        verifiedDate = this.createHumanDate(data.email_last_updated);
        break;
      case 'corporate_phone':
        verifiedDate = this.createHumanDate(data.corporate_phone_last_updated);
        break;
      case 'direct_phone':
        verifiedDate = this.createHumanDate(data.direct_phone_last_updated);
        break;
      case 'mobile_number':
        verifiedDate = this.createHumanDate(data.mobile_number_last_updated);
        break;
      case 'personal_email':
        verifiedDate = this.createHumanDate(data.personal_email_last_update);
        break;
      default:
        verifiedDate = null;
        break
    }
    return verifiedDate;
  }

  private createHumanDate(dateString: any) {
    if (dateString) {
      var todayTime = new Date(dateString);
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      return month + "/" + day + "/" + year;
    } else {
      return null;
    }
  }

  buildRequestedContactRefreshParams() {
    let isWorkEmail = this.storageService.get('workEmail');
    let isPersonalEmail = this.storageService.get('personaEmail');
    let isCropPhone = this.storageService.get('corpPhone');
    let isDirectPhone = this.storageService.get('directPhone');
   
    let params = [];
    
    if (isWorkEmail) { params.push({ name: 'email', priority_order: 2 }) }
    if (isCropPhone) { params.push({ name: 'corporate_phone', priority_order: 3 }) }
    if (isDirectPhone) { params.push({ name: 'direct_phone', priority_order: 4 }) }
    if (isPersonalEmail) { params.push({ name: 'personal_email', priority_order: 7 }) }
    return params;
  }

  buildContactPayloadForRefresh(profile: Contact, selectedPosition: any) {
    let params = null
    params = {
      company_name: selectedPosition.company_name,
      ds_contact_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      linkedin_url: profile.linkedin_url,
      position_id: selectedPosition.id
    }

    return params;
  }
}
