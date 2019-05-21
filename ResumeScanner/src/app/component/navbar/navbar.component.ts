import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/common/services/dashboard.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;


  constructor(private dashboard_service: DashboardService) { }

  ngOnInit() {
  }

  public async downloadZip(): Promise<void> {
    const blob: any = await this.dashboard_service.downloadResource();
    const url = window.URL.createObjectURL(blob);

    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = 'Resumes.zip';
    link.click();

    window.URL.revokeObjectURL(url);
  }

}
