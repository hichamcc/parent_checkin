import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudentService} from "../../_services/student.service";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SchoolService } from "../../_services/school.service";
import {SocketService} from "../../_services/socket.service";

@Component({
  selector: 'app-qr-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule],
  templateUrl: './qr-form.component.html',
  styleUrl: './qr-form.component.css'
})
export class QrFormComponent implements OnInit{
  studentName: string = '';
  nameSent: boolean = false;
  schoolId: number = 0;
  schoolName : string = '';

  constructor(private studentService: StudentService , private route: ActivatedRoute, private schoolService: SchoolService  , private socketService: SocketService) { }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.schoolId = params['id'];
        this.getSchoolDetails(this.schoolId);
      });
    }



  getSchoolDetails(schoolId: number) {
    this.schoolService.getSchoolById(schoolId).subscribe(
      (response) => {
        this.schoolName = response.name;
      },
      (error) => {
        console.error('Error fetching school details:', error);
      }
    );
  }


  addStudent() {
    console.log(this.studentName)
    if (this.studentName) {
      this.socketService.emit('newStudent', [this.studentName ,this.schoolId ]);
      this.studentService.addStudent(this.studentName , this.schoolId).subscribe(
        (response) => {
          console.log('Student added successfully:', response);
          this.nameSent = !this.nameSent;
        },
        (error) => {
          console.error('Error adding student:', error);
          // Handle error, e.g., show an error message
        }
      );
    }
  }

}
