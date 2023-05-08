import { Component, OnInit } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
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
  filterValue: number | null = null;


  constructor(private studentService: StudentService, private el: ElementRef) {}
  

  ngOnInit(): void {
    this.studentService.getStudents().subscribe((students) => {
      this.students = students;
      this.filteredStudents = students;
    });
  }

  editStudent(student: any): void {
    this.selectedStudent = { ...student }; // Create a copy of the student object
  
    this.scrollToEditDiv();
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
  
      // Scroll back to the edited student row
      this.scrollToStudentList(updatedStudent.id);
    });
  }

  scrollToEditDiv() {
    setTimeout(() => {
      const editDiv = this.el.nativeElement.querySelector('.mt-5');
      if (editDiv) {
        editDiv.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }
  
  scrollToStudentList(studentId: number) {
    setTimeout(() => {
      const studentRow = this.el.nativeElement.querySelector(`.student-row[data-student-id="${studentId}"]`);
      if (studentRow) {
        studentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
        // Add the 'flash' class after scrolling
        setTimeout(() => {
          studentRow.classList.add('flash');
  
          // Remove the 'flash' class after the animation has finished
          setTimeout(() => {
            studentRow.classList.remove('flash');
          }, 1000); // The duration of the flash animation
        }, 1000); // Adjust this value if needed to ensure the flash starts after the scroll is complete
      }
    }, 0);
  }
  
  

  searchByName(students: any[]): any[] {
    if (!this.searchTerm) {
      return students;
    }

    return students.filter((student) =>
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterByFinancial(students: any[]): any[] {
    if (this.filterValue === null) {
      return students;
    }
  
    const filterNumber = parseFloat(this.filterValue.toString());
  
    if (isNaN(filterNumber)) {
      return students;
    }
  
    return students.filter((student) => {
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
  

  applyFilters(): void {
    const nameFilteredStudents = this.searchByName(this.students);
    this.filteredStudents = this.filterByFinancial(nameFilteredStudents);
  }
  
  sortTable(column: string): void {
    const sortOrder = this.sortOrders[column] = !this.sortOrders[column];
    this.filteredStudents = this.filteredStudents.sort((a, b) => {
      if (a[column] < b[column]) {
        return sortOrder ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return sortOrder ? 1 : -1;
      }
      return 0;
    });
  }

  sortOrders: { [key: string]: boolean } = {
    id: true,
    name: true,
    balance: true,
    financialAid: true,
    tuition: true,
    fees: true,
    scholarships: true,
  };
  
  
  

  // Add other methods to handle updates, additions or deletions here, if needed.
}
