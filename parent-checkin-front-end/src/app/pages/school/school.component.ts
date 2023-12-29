import {Component, Inject , Optional, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {School} from "../../_models/school.model";
import {SchoolService} from "../../_services/school.service";
import { MatTableModule , MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {AddSchoolComponent} from "./add-school/add-school.component";
import { FormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule , MatDialog, MatDialogRef} from '@angular/material/dialog';
import { QrCodeService } from '../../_services/qr-code.service';
@Component({
  selector: 'app-school',
  standalone: true,
  imports: [RouterOutlet , MatIconModule , FormsModule , MatTableModule , AddSchoolComponent , MatDialogModule],
  templateUrl: './school.component.html',
  styleUrl: './school.component.css',
  providers: [
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: []},
  ]
})
export class SchoolComponent implements OnInit{

  constructor(public dialog: MatDialog  ,
              private schoolService: SchoolService,
              private qrCodeService: QrCodeService,
              public dialogRef: MatDialogRef<AddSchoolComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.schools = this.schoolService.getSchools();

  }

  schools: School[];
  dataSource = new MatTableDataSource<any>([]) ;

  displayedColumns: string[] = ['name', 'qrCode', 'tvLink', 'actions'];

  textToSpeak: string = '';
  baseUrl: string = window.location.origin;


  ngOnInit() {
    this.getAllSchools();
  }

  speak(): void {
    console.log(this.textToSpeak)
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
    speechSynthesis.getVoices().forEach((voice) => {
      console.log(voice.name, voice.lang)
    })  }



  deleteSchool(id: number): void {
    this.schoolService.deleteSchool(id).subscribe(
      () => {
        console.log(`School with id ${id} deleted successfully.`);
        this.getAllSchools();
      },
      (error) => {
        console.error('Error deleting school:', error);
      }
    );
  }
  getAllSchools():any {
    this.schoolService.getAllSchools().subscribe((schools) => {
      this.schools = schools;
      this.dataSource.data = this.schools ;
      this.dataSource.data.forEach((school) => {
        this.generateQrCodeForSchool(school);
      });
    });
  }

  private generateQrCodeForSchool(school: any): void {
    const qrCodeData = `${this.baseUrl}/qr-form/${school.id}`;

    this.qrCodeService.generateQrCode(qrCodeData).then((qrCodeUrl) => {
      // Attach the QR code URL to the school object
      school.qrCodeUrl = qrCodeUrl;
    });
  }


   onAddSchool(newSchool: any): void {
     this.schoolService.createSchool(newSchool.name , '').subscribe((response) => {
       console.log('School created:', response);
     });
    // Refresh the data
     this.getAllSchools();
  }

  openAddSchoolModal(): void {
    const dialogRef = this.dialog.open(AddSchoolComponent, {
      width: '600px', // Set the width as per your design
      height: '300px', // Set the width as per your design
      data: {} // You can pass data to the dialog if needed
    });


    dialogRef.componentInstance.addSchool.subscribe((newSchool: any) => {
      // Handle the emitted event here
      const id = this.dataSource.data.length + 1;
      const newSchoolObj = { id, ...newSchool };
      this.onAddSchool(newSchoolObj);
      // Trigger the table to redraw
      this.dialog.closeAll()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);

      // Handle the result after the dialog is closed
      if (result) {
        // Logic for adding a new school
      }
    });
  }


}
