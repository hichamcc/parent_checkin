import { Injectable } from '@angular/core';
import {HttpHeaders , HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.endpoint+'student'

  constructor(private http: HttpClient) { }

  // Add a new student
  addStudent(name: string , schoolId:number): Observable<any> {
    const url = `${this.apiUrl}/add-student`;
    return this.http.post(url, { name , schoolId },{ ...httpOptions, responseType: 'text' });
  }

  // Get recent students (created in the last hour)
  getRecentStudents(schoolId:number): Observable<any> {
    const url = `${this.apiUrl}/get-students/${schoolId}`;
    return this.http.get(url,{ ...httpOptions, responseType: 'json' });
  }


}
