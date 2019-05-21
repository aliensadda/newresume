import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/component/dashboard/dashboard.component';
import { ScanResumeComponent } from 'src/app/component/scan-resume/scan-resume.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'dash', component: DashboardComponent },
  {
    path: 'scan', component: ScanResumeComponent

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
