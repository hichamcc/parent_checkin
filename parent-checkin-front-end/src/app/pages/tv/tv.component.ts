import {Component,  OnDestroy, OnInit,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {SocketService} from "../../_services/socket.service";
import { CommonModule } from '@angular/common';
import {StudentService} from "../../_services/student.service";
import {SchoolService} from "../../_services/school.service";
import { takeWhile } from 'rxjs/operators';
import { interval } from 'rxjs';
import {ActivatedRoute} from "@angular/router";
import * as transliteration from 'transliteration';

@Component({
  selector: 'app-tv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv.component.html',
  styleUrl: './tv.component.css'
})
export class TvComponent implements OnInit , OnDestroy , AfterViewInit{
  students: any[] = [];
  private alive: boolean = true;
  call: boolean = false;
  currentStudent:any = "";
  schoolId: number = 0;
  englishName: string = "";
  schoolName: string = "";
  start: boolean = false;

  private speechQueue: string[] = [];
  private nameQueue: string[] = [];
  private isSpeaking: boolean = false;
  @ViewChild('startButton') startButton!: ElementRef;

  constructor(private socketService: SocketService, private schoolService: SchoolService, private studentService: StudentService ,   private route: ActivatedRoute) {

  }


  startTv(){
    this.start = true;
  }
  toggleCall() {
    this.call = true;
    this.isSpeaking = true;

    // Set a timeout to change the value back to false after 4 seconds
    setTimeout(() => {
      this.call = false;
      this.isSpeaking = false;
      this.speakNextInQueue()
      console.log(this.call)
    }, 4000);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.schoolId = params['id'];
    });
    this.getSchoolDetails(this.schoolId);
    this.getRecentStudents();



    // Listen for newStudent events from the server
    this.socketService.listen('newStudent').subscribe((newStudent) => {
      if(parseInt(newStudent[1])  == this.schoolId ){
        this.students.unshift(newStudent[0]);
        this.englishName = newStudent[2];
        console.log(this.englishName);
        this.studentSpeech(this.englishName ,newStudent[0] );
      }
    });


    // Schedule the function to be called every 3 minutes (180,000 milliseconds)
    interval(3 * 60 * 1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.getRecentStudents();
      });

  }

  ngAfterViewInit(): void {
    if (this.startButton && this.startButton.nativeElement) {
      this.startButton.nativeElement.focus();
    }
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

  studentSpeech(Englishname : string , currentName:string){
    // Add the name to the speech queue
    this.speechQueue.push(Englishname);
    this.nameQueue.push(currentName);

    // If speech is not currently ongoing, start speaking
    if (!this.isSpeaking) {
      this.speakNextInQueue();
    }
  }

  private speakNextInQueue() {
    if (this.speechQueue.length === 0) {
      // No more items in the queue
      this.isSpeaking = false;
      this.call = false;
      return;
    }

    const nextName = this.speechQueue.shift();
    const utterance = nextName;

    // Set a flag to indicate that speech is ongoing
    this.isSpeaking = true;

    this.currentStudent = this.nameQueue.shift();
    this.call = true;


    // Specify the MP3 URL
    const mp3Url = 'http://localhost:3000/'+utterance;

    // Create an Audio object
    const audio = new Audio(mp3Url);
    const playCount = 4;

    let count = playCount;

      audio.play();

    setTimeout(() => {
      audio.play();
    }, 3000);
    setTimeout(() => {
      audio.play();
    }, 6000);
    setTimeout(() => {
      audio.play();
    }, 9000);

    // while (count > 0) {
    //   audio.play()
    //     .then(() => {
    //       // Decrease the count and play again when it finishes
    //       count--;
    //       if (count > 0) {
    //         audio.currentTime = 0; // Reset the audio to the beginning
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Error playing audio:', error);
    //     });
    // }

    setTimeout(() => {
      this.speakNextInQueue();
    }, 12000);

  }

  ngOnDestroy() {
    // Stop the interval when the component is destroyed
    this.alive = false;
  }


  getRecentStudents(){
    this.students = [];

    this.studentService.getRecentStudents(this.schoolId).subscribe((students) => {
      students.map((student : any)=>{
        this.students.push(student.name);
      })
    });
  }
}
