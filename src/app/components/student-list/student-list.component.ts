import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  
})
export class StudentListComponent implements OnInit {
  students: any[] = []; // Provide an initial value
  selectedStudent: any = null; 
  searchTerm: string = '';
  filteredStudents: any[] = [];
  selectedField: string = 'balance';
  comparison: string = 'less';
  filterValue: number = 0;


  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe((students) => {
      this.students = students;
      this.filteredStudents = students; 
    });
  }

  editStudent(student: any): void {
    this.selectedStudent = { ...student }; // Create a copy of the student object
  }

  onSubmit(): void {
    // Call the updateStudent method in the studentService to save changes
    this.studentService.updateStudent(this.selectedStudent).subscribe((updatedStudent) => {
      // Find the index of the updated student in the students array
      const index = this.students.findIndex((student) => student.id === updatedStudent.id);

      // Update the students array with the new data
      this.students[index] = updatedStudent;

      // Reset the selectedStudent to hide the form
      this.selectedStudent = null;
    });
  }

  search(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter((student) =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  filter(): void {
    const filterNumber = parseFloat(this.filterValue.toString());
  
    if (isNaN(filterNumber)) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter((student) => {
        switch (this.comparison) {
          case 'less':
            return student[this.selectedField] < filterNumber;
          case 'equal':
            return student[this.selectedField] === filterNumber;
          case 'greater':
            return student[this.selectedField] > filterNumber;
          default:
            return true;
        }
      });
    }
  }
  
  
  

  // Add other methods to handle updates, additions or deletions here, if needed.
}
