import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsUrl = 'assets/students.json';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<any> {
    return this.http.get<any>(this.studentsUrl);
  }

  updateStudent(updatedStudent: any): Observable<any> {
    // Here, you'll typically send an HTTP PUT/POST request to the backend to update the student.
    // Since we're using a local JSON file, we'll read the file, update the student data, and write the file back.
  
    // For this demo, we'll simply return an Observable with the updatedStudent data.
    return of(updatedStudent);
  }
  

  // Add other methods to update, add or delete students here, if needed.
}
