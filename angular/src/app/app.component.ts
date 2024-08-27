import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { RequestService } from './services/request.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { DataSharingService } from './services/data-sharing.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule ],
  providers: [RequestService, HttpClient, DataSharingService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
