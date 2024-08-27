import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  @Output() onNavBarAction = new EventEmitter<any>();
  @Output() onRefreshPage = new EventEmitter<boolean>();
  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    
  }

  onDoRefresh() {
    this.onNavBarAction.emit({action: 'refresh'})
  }

  showSettingPage() {
    this.onNavBarAction.emit({action: 'setting'})
  }

}

