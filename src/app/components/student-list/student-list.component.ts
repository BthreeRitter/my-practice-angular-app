import { Component, OnInit } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  
})
export class StudentListComponent implements OnInit {
  // Declare component properties with their types and initial values
  students: any[] = []; // Provide an initial value
  selectedStudent: any = null; 
  searchTerm: string = '';
  filteredStudents: any[] = [];
  selectedField: string = 'balance';
  comparison: string = 'less';
  filterValue: number | null = null;

  // Inject the StudentService and ElementRef into the component
  constructor(private studentService: StudentService, private el: ElementRef) {}
  
  // Load the students from the StudentService on component initialization
  // This ensures that the data is fetched and displayed as soon as the component is loaded
  ngOnInit(): void {
    this.studentService.getStudents().subscribe((students) => {
      this.students = students;
      this.filteredStudents = students;
    });
  }

  // Set the selectedStudent to a copy of the student object and scroll to the edit form
  // This allows users to edit the student information without directly modifying the original data
  // and ensures a smooth transition to the edit form
  editStudent(student: any): void {
    this.selectedStudent = { ...student }; // Create a copy of the student object
  
    this.scrollToEditDiv();
  }

  // Save the changes made to the selectedStudent and scroll back to the edited student row
  // This handles the update process and provides visual feedback to the user after the update is complete
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

  // Scroll smoothly to the edit form
  // This improves the user experience by automatically scrolling to the edit form
  // when a user selects a student to edit
  scrollToEditDiv() {
    setTimeout(() => {
      const editDiv = this.el.nativeElement.querySelector('.mt-5');
      if (editDiv) {
        editDiv.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }
  
  // Scroll to the edited student row and apply the flash animation
  // This provides visual feedback to users after editing a student, allowing them
  // to easily locate the updated student data in the table
  scrollToStudentList(studentId: number) {
    setTimeout(() => {
      // Select the student row using the data-student-id attribute
      const studentRow = this.el.nativeElement.querySelector(`.student-row[data-student-id="${studentId}"]`);
      if (studentRow) {
        // Scroll smoothly to the student row, aligning it to the center of the viewport
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

  
    // Filter students by their name based on the searchTerm
  // This provides a quick and efficient way to search for students
  // in the list by their name without having to iterate through the list manually
  searchByName(students: any[]): any[] {
    // If there's no searchTerm, return the original student array
    if (!this.searchTerm) {
      return students;
    }

    // Filter the student array based on whether their name contains the searchTerm (case-insensitive)
    return students.filter((student) =>
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Filter students by the selected financial field and comparison value
  // This enables users to find students based on specific financial criteria,
  // making it easier to analyze the student data and make informed decisions
  filterByFinancial(students: any[]): any[] {
    // If there's no filterValue, return the original student array
    if (this.filterValue === null) {
      return students;
    }

    // Convert filterValue to a number and ensure it's a valid number
    const filterNumber = parseFloat(this.filterValue.toString());
    if (isNaN(filterNumber)) {
      return students;
    }

    // Filter the student array based on the selected financial field and comparison value
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

  // Apply the name and financial filters to the students array
  // This method allows for a combination of both filters, providing
  // more granular control over the displayed student data
  applyFilters(): void {
    const nameFilteredStudents = this.searchByName(this.students);
    this.filteredStudents = this.filterByFinancial(nameFilteredStudents);
  }

  // Sort the filtered students array based on the given column and toggle the sort order
  // This provides an easy and intuitive way for users to sort the data by any column,
  // making it easier to analyze and understand the student data
  sortTable(column: string): void {
    // Toggle the sort order for the selected column
    const sortOrder = this.sortOrders[column] = !this.sortOrders[column];

    // Sort the filteredStudents array based on the selected column and sort order
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

  // Define the initial sort orders for each column
  // This object keeps track of the current sort order for each column,
  // allowing the sortTable method to toggle the sort order when called
  sortOrders: { [key: string]: boolean } = {
    id: true,
    name: true,
    balance: true,
    financialAid: true,
    tuition: true,
    fees: true,
    scholarships: true,
  };
}

