import { CommonModule } from '@angular/common'
import { Component, Inject, signal } from '@angular/core'
import { TAB_ID } from 'src/app/app.config'
import { AuthComponent } from './components/auth/auth.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { StorageService } from 'src/app/services/storage.service'
import { ResultPageComponent } from './components/result-page/result-page.component'
import { CrmSettingComponent } from './components/crm-setting/crm-setting.component'
import { LoaderComponent } from './components/loader/loader.component'

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, 
    AuthComponent, 
    NavbarComponent, 
    CrmSettingComponent,
    ResultPageComponent,
    LoaderComponent
  ],
  providers: [StorageService],
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent {

  isUserLoggedIn = false;
  showSettingPage = false;
  showLoader = false;

  message = signal('')

  constructor(@Inject(TAB_ID) readonly tabId: number, private storageService: StorageService) {
   this.checkLogin();
  }

  onClick() {
    chrome.tabs.sendMessage(this.tabId, 'request', (msg) => {
      debugger
      this.message.set(
        chrome.runtime.lastError
          ? 'The current page is protected by the browser, goto: https://www.google.nl and try again.'
          : msg
      )
    })
  }

  checkLogin() {
    this.isUserLoggedIn = this.storageService.get('userLogged');
  }

  onNavBarAction(resp: any) {
    if(resp.action == 'refresh') {
      this.showSettingPage = false;
    }

    if(resp.action == 'setting') {
      this.showSettingPage = true;
    }
  }

  onLogout(isLogout: boolean) {
    this.storageService.clear();
    this.showSettingPage = false;
    this.checkLogin();
  }
}
