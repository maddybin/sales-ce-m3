import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  providers: [AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  @ViewChild('dsUserEmail') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dsUserPassword') passWordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('terms') acceptTerms!: ElementRef<HTMLInputElement>;

  @Output() onUserLoggedIn = new EventEmitter<boolean>();

  password = '';
  email = '';
  signingButtonText = 'Sign In';
  accept: any;
  showLoader = false;

  constructor(private authService: AuthService,
    private storageService: StorageService
  ) {
  }

  onSubmit() {
    this.email = this.emailInput.nativeElement.value;
    this.password = this.passWordInput.nativeElement.value;
    this.accept = this.acceptTerms.nativeElement.checked;
    
    debugger
    if(this.email && this.password && this.accept) {
      const userPayload = { user: {
        email: this.email,
        password: this.password
      }}

      if(this.accept) {
        this.signingButtonText = 'Loading...';
        this.showLoader = true;
        this.authService.login(userPayload).subscribe({
          next: resp => {
            this.signingButtonText = 'Sign In';
            this.storageService.set('userLogged', resp);
            this.onUserLoggedIn.emit(true);
            this.showLoader = false;
          }, error: err => {
            this.showLoader = false;
            this.signingButtonText = 'Sign In';
            this.onUserLoggedIn.emit(false);
          }
        })
      } 
      
    }
  }
  
}
