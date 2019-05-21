import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import {Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(public httpClient: HttpClient) { }

  private refreshNeeded = new Subject<void>();

  getRefreshNeeded(){
    return this.refreshNeeded;
  }

  fileUpload(data) {
    const endpoint = environment.apiUrl + 'api/app_resume/upload_resume';
    return this.httpClient.post(endpoint, data, {responseType: 'text'})
      .pipe(
        tap(() => {
          this.refreshNeeded.next();
        })
      )
  }

   getProfileList() {
    return this.httpClient.get(environment.apiUrl +'api/app_resume/get_profile')
  }

  addJob(data){
    return this.httpClient.post(environment.apiUrl + 'api/app_resume/save_profile', data, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.refreshNeeded.next();
        })
      )
  }

  editJob(data){
    return this.httpClient.post(environment.apiUrl + 'api/app_resume/update_profile', data, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.refreshNeeded.next();
        })
      )
  }

  scanJob(data){
    return this.httpClient.post(environment.apiUrl +'api/app_resume/scan_results2',data,{responseType:'text'});
  }

  public async fileDownload(qryParams): Promise<Blob> {
    let url = environment.apiUrl + 'api/app_resume/preview',
      options = {
        params: qryParams
      }
    options['responseType'] = 'blob' as 'json';

    const file = await this.httpClient.get<Blob>(url, options).toPromise();
    return file;
  }

  public async downloadResource(): Promise<Blob> {
    let url = environment.apiUrl +'api/app_resume/download_template/',
    options = {}
    options['responseType'] = 'blob' as 'json';
    console.log(options);

    const file =  await this.httpClient.get<Blob>(url, options).toPromise();
    return file;
  }
  
}
