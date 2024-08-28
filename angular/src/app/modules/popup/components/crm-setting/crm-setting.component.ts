import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-crm-setting',
  standalone: true,
  imports: [],
  templateUrl: './crm-setting.component.html',
  styleUrl: './crm-setting.component.scss'
})
export class CrmSettingComponent {

  @Output() onLogoutAction = new EventEmitter<boolean>();

  versionNumber = 'v3.0';
  dateLastUpdated = '08/28/2024' 
  


  logOut() {
    this.onLogoutAction.emit(true)
  }
}
