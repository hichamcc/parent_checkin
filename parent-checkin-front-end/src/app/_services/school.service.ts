// school.service.ts
import { Injectable } from '@angular/core';
import {School} from "../_models/school.model";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiUrl = environment.endpoint+'school'
  private schools: School[] = [
    new School(1, 'School A'),
    new School(2, 'School B'),
    // Add more schools as needed
  ];


  constructor(private http: HttpClient) {}

  getSchools(): School[] {
    return this.schools;
  }
  getAllSchools(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-schools`, { ...httpOptions, responseType: 'json' });
  }

  getSchoolById(schoolId: number): Observable<any> {
    const url = `${this.apiUrl}/get-school/${schoolId}`;
    return this.http.get(url, { ...httpOptions, responseType: 'json' });
  }

  createSchool(name: string, logo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-schools`, { name, logo } , { ...httpOptions, responseType: 'text' });
  }

  addSchool(newSchool: School): void {
    const data = new School(newSchool.id , newSchool.name)
    if (data) {
      this.schools.push(data);
    } else {
      console.error('Invalid school object. Cannot add to the array.');
    }
  }
  deleteSchool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-schools/${id}`);
  }
}
