import {Component, Output, EventEmitter, Inject, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-add-school',
  standalone: true,
  imports: [FormsModule , MatDialogModule],
  templateUrl: './add-school.component.html',
  styleUrl: './add-school.component.css',
})

export class AddSchoolComponent {


  @Output() addSchool = new EventEmitter<any>();

  newSchoolName: string = '';
  newQrCode: string = '';
  newTvLink: string = '';

  addNewSchool(): void {
    this.addSchool.emit({
      name: this.newSchoolName,
      qrCode: this.newQrCode,
      tvLink: this.newTvLink
    });

    // Reset form fields
    this.newSchoolName = '';
    this.newQrCode = '';
    this.newTvLink = '';
  }
}
