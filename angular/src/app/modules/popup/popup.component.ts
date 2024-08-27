import { CommonModule } from '@angular/common'
import { Component, Inject, signal } from '@angular/core'
import { TAB_ID } from 'src/app/app.config'
import { AuthComponent } from './components/auth/auth.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { SavedListComponent } from './components/saved-list/saved-list.component'
import { RefreshSettingComponent } from './components/refresh-setting/refresh-setting.component'
import { StorageService } from 'src/app/services/storage.service'
import { ResultPageComponent } from './components/result-page/result-page.component'

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, 
    AuthComponent, 
    NavbarComponent, 
    SavedListComponent,
    RefreshSettingComponent,
    ResultPageComponent
  ],
  providers: [StorageService],
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent {

  isUserLoggedIn = false;

  message = signal('')

  constructor(@Inject(TAB_ID) readonly tabId: number, private storageService: StorageService) {
    if (storageService.get('userLogged')) {
      this.isUserLoggedIn = true;
    }
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
}
