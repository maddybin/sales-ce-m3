import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  providers: [AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  @ViewChild('dsUserEmail') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dsUserPassword') passWordInput!: ElementRef<HTMLInputElement>;

  @Output() onUserLoggedIn = new EventEmitter<boolean>();

  password = '';
  email = '';
  signingButtonText = 'Sign In';

  constructor(private authService: AuthService,
    private storageService: StorageService
  ) {
  }

  onSubmit() {
    this.email = this.emailInput.nativeElement.value;
    this.password = this.passWordInput.nativeElement.value;
    this.signingButtonText = 'Loading...';

    if(this.email && this.password) {
      const userPayload = { user: {
        email: this.email,
        password: this.password
      }}

      this.authService.login(userPayload).subscribe({
        next: resp => {
          this.signingButtonText = 'Sign In';
          this.storageService.set('userLogged', resp);
          this.onUserLoggedIn.emit(true);
        }, error: err => {
          this.signingButtonText = 'Sign In';
          this.onUserLoggedIn.emit(false);
        }
      })
    }
  }
}
