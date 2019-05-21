import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/common/services/dashboard.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('downloadPdfLink') private downloadPdfLink: ElementRef;

  myFiles: string[] = [];
  jobProDesc: any;
  selectedJobProfile: any;
  selectedJobDescription: any;
  selectedJobId: any;
  selectedResumeCount: any
  jobData: any = {};
  user: any;
  scannedData: any = {};
  fileName: any = {};

  constructor(private dashboard: DashboardService) { }

  ngOnInit() {
    $('.img-upload').hide()
    $('.files').hide();
    $('.table').hide();
    $('#upload-file').attr('disabled', true);
    $('.job-text').attr('readonly', false);
    $('.desc-text').attr('readonly', false);
    $('.desc-add').hide();
    $('.job-save').show();
    $('.editjob-save').hide();
    // $('.desc-edit').attr('disabled', true);
    $('.desc-edit').hide();

    this.dashboard.getRefreshNeeded()
      .subscribe(() => {
        this.getData()
      });

    this.getData();

    $(document).ready(function () {

      $('.job-text, .desc-text').keyup(function () {
        if ($('.job-valid').val() !== '' && $('.desc-valid').val() !== '') {
          $('.job-save').attr('disabled', false);

        }
        else {
          $('.job-save').attr('disabled', true);

        }
      })

      $('.job-text').keyup(function () {
        if ($('.job-valid').val() !== '') {
          $('.help-block-j').attr('hidden', true);
        } else {
          $('.help-block-j').attr('hidden', false);
        }
      })

      $('.desc-text').keyup(function () {
        if ($('.desc-valid').val() !== '') {
          $('.help-block-d').attr('hidden', true);
        } else {
          $('.help-block-d').attr('hidden', false);
        }
      })

      //job filter
      $(".job-search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".job-profile").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });

      //onselect class
      $(".job-profile").click(function () {
        $('.active').removeClass('active');
        $(this).addClass('active')
        $('.desc-edit').show();

      })
    })

    $(".desc-add").click(function () {
      $('.files').hide();
      if ('.job-text.value !=="" ') {
        $('.job-text').val('');
        $('.job-text').removeAttr('readonly');
      }

      if ('.desc-text.value !=="" ') {
        $('.desc-text').val('');
        $('.desc-text').removeAttr('readonly');
      }

      $('.job-save').show();
      $('.desc-edit').hide();
      $('.editjob-save').hide();

      $(this).hide();
    })

    $('.desc-edit').click(function () {
      $('.editjob-save').show();
      $('.job-text').removeAttr('readonly');
      $('.desc-text').removeAttr('readonly');
      $('.desc-add').hide();
      $('.job-save').hide();
      $(this).hide();
    })
  }


  private getData() {
    this.dashboard.getProfileList().subscribe(data => {
      console.log(data);
      this.jobProDesc = data;

    });
  }


  onSelect(job) {
    this.selectedJobProfile = job.job_profile;
    this.selectedJobDescription = job.job_description;
    this.jobData.job_description = job.job_description
    this.jobData.job_profile = job.job_profile
    this.selectedJobId = job.id;
    console.log(this.selectedJobId);

    this.selectedResumeCount = job.resume_count;
    $('.files').show();
    $('#upload-file').attr('disabled', false);
    $('.desc-edit').attr('disabled', false);
    $('.job-text').attr('readonly', true);
    $('.desc-text').attr('readonly', true);
    $('.job-save').hide();
    $('.desc-add').show();
    $('.desc-edit').show();
    $('.help-block-j').attr('hidden', true);
    $('.help-block-d').attr('hidden', true);
    $('.file-submit').attr('disabled', false);
    $('.table').hide();
    // console.log(this.selectedJob);

  }


  handleFileInput(e) {
    this.myFiles = []
    for (var i = 0; i < e.target.files.length; i++) {
      console.log(e.target.files, "files");
      this.myFiles.push(e.target.files[i]);
    }
    $('.file-submit').attr('hidden', false);
    $('.file-submit').attr('disabled', false);

  }


  uploadFileToActivity() {
    const frmData = new FormData();
    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("files", this.myFiles[i]);
    }
    console.log(this.selectedJobId);

    frmData.append("id", this.selectedJobId);
    this.dashboard.fileUpload(frmData).subscribe(data => {
      console.log(JSON.parse(data));
      let incoming_data = JSON.parse(data);
      let count = incoming_data['count']
      this.selectedResumeCount = count;
      let msg = 'Upload Successful!';
      this.spawnAlert(msg, true);

      $('.file-submit').attr('disabled', true);
    }, error => {
      let msg = 'Upload Failed!';
      this.spawnAlert(msg, false);
    });
  }


  createJob(data) {
    let formData = new FormData;
    formData.set('job_profile', data['job_profile'])
    formData.set('job_description', data['job_description'])
    console.log(data);
    this.dashboard.addJob(formData).subscribe(res => {
      console.log(res);
      let msg = 'Created Successfully!';
      this.spawnAlert(msg, true);

      $('.job-text').val('');
      $('.desc-text').val('');
      $('.files').show();
      $(".desc-add").show();
      $('.job-save').hide();
      $('.desc-edit').show();
      $('.job-text').attr('readonly', true);
      $('.desc-text').attr('readonly', true);
    },
      error => {
        let msg = 'Creation Failed';
        this.spawnAlert(msg, false);
      })
  }

  scanJob() {
    console.log("scanner")
    let scanner = new FormData;
    scanner.set('id', this.selectedJobId);
    $('.img-upload') .show()
    this.dashboard.scanJob(scanner).subscribe(res => {
      $('.img-upload').hide()
      $('.table').show();
      this.scannedData = JSON.parse(res);
    },
    error=>{
      console.log("job description must be more than 3 paragraph");
      
    }
  )
  }


  editJob(data) {
    console.log('data--', this.jobData["job_profile"], this.jobData['job_description']);
    let fData = new FormData;
    fData.set('id', this.selectedJobId)
    fData.set('job_profile', this.jobData['job_profile'])
    fData.set('job_description', this.jobData['job_description'])
    this.dashboard.editJob(fData).subscribe(res => {
      console.log(res);
      console.log("ss");


      $('.job-text').attr('readonly', true);
      $('.desc-text').attr('readonly', true);
      let msg = 'Edited Successfullly!';
      this.spawnAlert(msg, true);
      $('.editjob-save').hide();
      $('.desc-edit').show();
      $('.desc-add').show();
      $('.files').show();

    },
      error => {
        let msg = 'Edit Failed!';
        this.spawnAlert(msg, false);

      })
  }


  public async downloadPdf(data, preview): Promise<void> {
    let params = {
      id: this.selectedJobId,
      name: data.name
    }

    const blob: any = await this.dashboard.fileDownload(params);
    const url = window.URL.createObjectURL(blob);

    const link = this.downloadPdfLink.nativeElement;
    link.removeAttribute('download');
    link.removeAttribute('target');
    link.href = url;

    if (preview) {
      link.target = '_blank';
      link.click();
    } else {
      link.download = data.name;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  spawnAlert(msg, success) {
    let alertElm = success ? $('.alert-success') : $('.alert-danger');
    alertElm.find('.message').text(msg);
    alertElm.show().fadeOut(3000);
  }

}
