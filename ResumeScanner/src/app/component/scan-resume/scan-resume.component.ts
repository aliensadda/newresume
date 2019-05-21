import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-scan-resume',
  templateUrl: './scan-resume.component.html',
  styleUrls: ['./scan-resume.component.css']
})
export class ScanResumeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("hiiiiiii");
    
    $('.upload-image').show();
  }

}
