import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VisitService } from '../services/visit.service';
import { Visit } from '../visit/visit.model';
import { PrescriptionService } from '../prescriptions/prescription.service';
import { Prescription } from '../prescriptions/prescription.model';
import { UserService } from '../services/user.service';
import { User } from '../visit/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading = false;
  prescriptionList: Prescription[] = [];
  filteredprescriptions: Prescription[] = [];
  prescription?: Prescription;
  visits: Visit[] = [];
  filteredVisits: Visit[] = [];
  newVisit: Visit = { id: 0, date: '',hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] };
  newprescription = { id: 0, telephone: '', note: '', visit: { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] }};
  pastVisits: Visit[] = [];
  upcomingVisits: Visit[] = [];

  visitToUpdate?: Visit;
  prescriptionToUpdate?: Prescription;
  searchTerm: string = '';
  searchTermPast: string = '';
  prescriptionSearchTerm: string = '';
  sortBy: string = 'date';
  prescriptionSortBy: string = 'surname';
  sortDirection: { [key: string]: boolean } = { date: true, surname: true };
  prescriptionSortDirection: { [key: string]: boolean } = { surname: true, telephone: true };
  selectedFiles: File[] = [];
  files: any[] = [];

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUserId: number | null = null;
  selectedVisitId: number | null = null;

  pastVisitSortBy: string = 'date';
  upcomingVisitSortBy: string = 'date';
  pastVisitSortDirection: { [key: string]: boolean } = { date: true, username: true };
  upcomingVisitSortDirection: { [key: string]: boolean } = { date: true, username: true };



  constructor(private visitService: VisitService, private prescriptionService: PrescriptionService, private userService: UserService) {}

  ngOnInit() {
    this.getUsers();
    this.getVisits();
    this.getprescriptions();

  }

  getprescriptions(): void {
    this.prescriptionService.getPrescriptions()
      .subscribe(prescriptionList => {
        this.prescriptionList = prescriptionList || [];
        this.filteredprescriptions = this.prescriptionList;
        this.sortprescriptions();
      });
  }

  getUsers(): void {
    this.userService.findAllUsers().subscribe(userList => {
      this.users = userList || [];
      this.filteredUsers = this.users;
    });
  }



  openVisitForm(userId: number): void {
    this.selectedUserId = userId;
    this.newVisit = { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] };
  }

  openprescriptionForm(visitId: number): void {
    this.selectedVisitId = visitId;
    this.newprescription = { id: 0, telephone: '', note: '', visit: { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] }};
  }

  loadUsers(): void {
    this.userService.findAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }
  /*
    this.visitService.addVisit(this.newVisit).subscribe((visit: Visit) => {
    this.visits.push(visit);
    this.filteredVisits.push(visit);
    this.sortVisits();
    this.newVisit = { patientName: '', patientSurname: '', email: '', date: '', note: '' };


  });
  */

  submitprescription(): void {
    if (this.selectedVisitId) {
      const selectedVisit = this.visits.find(visit => visit.id === this.selectedVisitId);


      if (!selectedVisit) {
        console.error('Selected user not found');
        return;
      }

      this.newprescription.visit.id = selectedVisit.id;
      this.newprescription.visit.date = selectedVisit.date;
      this.newprescription.visit.note = selectedVisit.note;
      this.newprescription.visit.user.id = selectedVisit.user.id;
      this.newprescription.visit.user.username = selectedVisit.user.username;
      this.newprescription.visit.user.email = selectedVisit.user.email;


      if (!this.newprescription.telephone.trim() || !this.newprescription.note.trim()) {
        console.log('Visit HAS NOT BEEN created:');
        return;
      }
      console.log('this.newprescription.visit.user.username: ' + this.newprescription.visit.user.username);
      console.log('this.newprescription.visit.user.email: ' +  this.newprescription.visit.user.email);

      this.prescriptionService.addPrescription(this.selectedVisitId, this.newprescription)
        .subscribe({
          next: (prescription: Prescription) => {
            this.prescriptionList.push(prescription);
            this.filteredprescriptions.push(prescription);
            console.log('Visit created:', prescription);
            this.reloadPage();


            this.sortprescriptions();
          },
          error: () => {
          },

        });
    }
  }

  reloadPage(): void {
    this.isLoading = true;
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // Submit the new visit
  submitVisit(): void {
    if (this.selectedUserId) {
      const selectedUser = this.users.find(user => user.id === this.selectedUserId);

      if (!selectedUser) {
        console.error('Selected user not found');
        return;
      }

      this.newVisit.user.id = selectedUser.id;
      this.newVisit.user.username = selectedUser.username;
      this.newVisit.user.email = selectedUser.email;

      if (!this.newVisit.date.trim() || !this.newVisit.note.trim()) {
        console.log('Visit HAS NOT BEEN created:');
        return;
      }
      console.log('this.newVisit.user.username: ' + this.newVisit.user.username);
      console.log('this.newVisit.user.email = selectedUser.email: ' +  this.newVisit.user.email);


      this.visitService.addVisit(this.newVisit.user.id, this.newVisit)
        .subscribe((visit: Visit) => {
          this.visits.push(visit);
          console.log('Visit created:', visit);
          this.newVisit = { id: 0, date: '', hour: '', note: '', user: { id: this.newVisit.user.id, username: this.newVisit.user.username, email: this.newVisit.user.email, password: '', visits: [], roles:[] }, prescriptions: [] };
          this.loadUsers();
          this.selectedUserId = null;
          this.reloadPage();

        });
    }
    else{
      console.log('Visit NOT created:');

    }
  }

  deleteprescription(prescription: Prescription): void {
    this.prescriptionList = this.prescriptionList.filter(c => c !== prescription);
    this.filteredprescriptions = this.filteredprescriptions.filter(c => c !== prescription); // Update filteredprescriptions
    this.prescriptionService.deletePrescription(prescription).subscribe();

  }

  scrollToVisitList() {
    const visitList = document.getElementById('visit-list');
    if (visitList) {
      visitList.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToPrescriptionList() {
    const prescriptionList = document.getElementById('prescription-list');
    if (prescriptionList) {
      prescriptionList.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateVisitAndUpdateScroll(visit: Visit) {
    this.populateVisitForUpdate(visit);
    this.scrollToUpdate();
  }

  scrollToUpdate() {
    const prescriptionList = document.getElementById('update-list');
    if (prescriptionList) {
      prescriptionList.scrollIntoView({ behavior: 'smooth' });
    }
  }





  toggleprescriptionSort(criteria: string): void {
    this.prescriptionSortBy = criteria;
    this.prescriptionSortDirection[criteria] = !this.prescriptionSortDirection[criteria];
    this.sortprescriptions();
  }

  sortprescriptions(): void {
    const direction = this.prescriptionSortDirection[this.prescriptionSortBy] ? 1 : -1;
    switch (this.prescriptionSortBy) {

      case 'username':
        this.filteredprescriptions.sort((a, b) => direction * a.visit.user.username.localeCompare(b.visit.user.username));
        break;

      case 'email':
        this.filteredprescriptions.sort((a, b) => direction * a.visit.user.email.localeCompare(b.visit.user.email));
        break;


      case 'telephone':
        this.filteredprescriptions.sort((a, b) => direction * a.telephone.localeCompare(b.telephone));
        break;
      default:
        this.filteredprescriptions.sort((a, b) => direction * a.telephone.localeCompare(b.telephone));
        break;
    }
  }

  filterprescriptions(): void {
    const searchTermLower = this.prescriptionSearchTerm.toLowerCase();
    this.filteredprescriptions = this.prescriptionList.filter(prescription =>
      prescription.telephone.toLowerCase().includes(searchTermLower)
    );
  }

  filterVisitsPast(): void {
    const searchTermLower = this.searchTermPast.toLowerCase();

    this.pastVisits = this.pastVisits.filter(visit =>
      visit.user.username.toLowerCase().includes(searchTermLower) ||
      visit.user.email.toLowerCase().includes(searchTermLower) ||
      visit.date.toLowerCase().includes(searchTermLower) ||
      visit.note.toLowerCase().includes(searchTermLower)

    );

  }

  filterVisitsUpcoming(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.upcomingVisits = this.upcomingVisits.filter(visit =>
      visit.user.username.toLowerCase().includes(searchTermLower) ||
      visit.user.email.toLowerCase().includes(searchTermLower) ||
      visit.date.toLowerCase().includes(searchTermLower)
    );
  }

  @ViewChild('prescriptionForm') prescriptionForm!: ElementRef;

  addprescriptionToVisit(visit: Visit) {
    window.scrollTo(0, 0);

    this.prescriptionForm.nativeElement['patient-Name'].value = visit.user.username;
    this.prescriptionForm.nativeElement['emailprescription'].value = visit.user.email;
    this.prescriptionForm.nativeElement['dateprescription'].value = visit.date;
    this.prescriptionForm.nativeElement['hourprescription'].value = visit.hour;

  }

  getVisits(): void {
    this.visitService.findAllVisits().subscribe(data => {
      this.visits = data;
      const now = new Date();
      this.pastVisits = this.visits.filter(visit => new Date(visit.date) < now);
      this.upcomingVisits = this.visits.filter(visit => new Date(visit.date) >= now);
      this.filteredVisits = [...this.visits];
      this.filteredVisits = data;
      this.sortVisits();
    }, error => {
      console.error('Error fetching visits:', error);
    });
  }


  addVisit(): void {
    if (!this.selectedUserId || !this.newVisit.date.trim() || !this.newVisit.note.trim() || !this.newVisit.hour.trim()) {
      return;
    }

    const selectedUser = this.users.find(user => user.id === this.selectedUserId);

    if (!selectedUser) {
      console.error('Selected user not found');
      return;
    }

    this.newVisit.user.id = selectedUser.id;
    this.newVisit.user.username = selectedUser.username;
    this.newVisit.user.email = selectedUser.email;

    this.visitService.addVisit(this.selectedUserId, this.newVisit)
      .subscribe((visit: Visit) => {
        this.visits.push(visit);
        console.log('Visit created:', visit);
        this.newVisit = { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] };
        this.loadUsers();
        this.selectedUserId = null;
      });
  }




  deleteVisit(visit: Visit): void {
    this.visits = this.visits.filter(v => v !== visit);
    this.filteredVisits = this.filteredVisits.filter(v => v !== visit);
    this.visitService.deleteVisiter(visit).subscribe();
    this.reloadPage();

  }

  populateVisitForUpdate(visit: Visit): void {
    this.visitToUpdate = { ...visit };
    //this.prescriptionToUpdate = visit.prescription ? { ...visit.prescription } : undefined;
  }

  updateVisit(): void {
    if (this.visitToUpdate) {
      this.visitService.updateVisit(this.visitToUpdate.user.id, this.visitToUpdate).subscribe(updatedVisit => {
        const index = this.visits.findIndex(v => v.id === updatedVisit.id);
        if (index !== -1) {
          this.visits[index] = updatedVisit;
          this.filteredVisits[index] = updatedVisit;
          this.sortVisits();
        }
        this.visitToUpdate = undefined;
      });
    }
  }

  /*
  updateprescription(): void {
    if (this.prescriptionToUpdate && this.visitToUpdate?.prescription) {
      this.prescriptionService.updateprescription(this.prescriptionToUpdate, 34).subscribe(updatedprescription => {
        if (this.visitToUpdate) {
          this.visitToUpdate.prescription = updatedprescription;
          this.visitService.updateVisit(this.visitToUpdate).subscribe(updatedVisit => {
            const index = this.visits.findIndex(v => v.id === updatedVisit.id);
            if (index !== -1) {
              this.visits[index] = updatedVisit;
              this.filteredVisits[index] = updatedVisit;
              this.sortVisits();
            }
            this.prescriptionToUpdate = undefined;
            this.visitToUpdate = undefined;
          });
        }
      });
    }
  }
*/
  toggleVisitSort(criteria: string): void {
    this.sortBy = criteria;
    this.sortDirection[criteria] = !this.sortDirection[criteria];
    this.sortVisits();
  }

  sortVisits(): void {
    const direction = this.sortDirection[this.sortBy] ? 1 : -1;
    switch (this.sortBy) {
      case 'date':
        this.filteredVisits.sort((a, b) => direction * a.date.localeCompare(b.date));
        break;
      case 'Patient name':
        this.filteredVisits.sort((a, b) => direction * a.user.username.localeCompare(b.user.username));
        break;
      default:
        this.filteredVisits.sort((a, b) => direction * a.date.localeCompare(b.date));
        break;
    }
  }

  filterUsers(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(searchTermLower) ||
      user.username.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower)
    );
  }
  toggleSort(criteria: string): void {
    this.sortBy = criteria;
    this.sortDirection[criteria] = !this.sortDirection[criteria];
    this.sortVisits();
  }

  toggleUserSort(criteria: string): void {
    this.sortBy = criteria;
    this.sortDirection[criteria] = !this.sortDirection[criteria];
    this.sortUsers();
  }

  sortUsers(): void {
    const direction = this.sortDirection[this.sortBy] ? 1 : -1;
    switch (this.sortBy) {
      case 'username':
        this.filteredUsers.sort((a, b) => direction * a.username.localeCompare(b.username));
        break;
      case 'email':
        this.filteredUsers.sort((a, b) => direction * a.email.localeCompare(b.email));
        break;
      default:
        this.filteredUsers.sort((a, b) => direction * a.username.localeCompare(b.username));
        break;
    }
  }

  togglePastVisitSort(criteria: string): void {
    this.pastVisitSortBy = criteria;
    this.pastVisitSortDirection[criteria] = !this.pastVisitSortDirection[criteria];
    this.sortPastVisits();
  }

  sortPastVisits(): void {
    const direction = this.pastVisitSortDirection[this.pastVisitSortBy] ? 1 : -1;
    switch (this.pastVisitSortBy) {
      case 'date':
        this.pastVisits.sort((a, b) => direction * a.date.localeCompare(b.date));
        break;
      case 'username':
        this.pastVisits.sort((a, b) => direction * a.user.username.localeCompare(b.user.username));
        break;
      case 'note':
        this.pastVisits.sort((a, b) => direction * a.note.localeCompare(b.note));
        break;
      default:
        this.pastVisits.sort((a, b) => direction * a.date.localeCompare(b.date));
        break;
    }
  }

  toggleUpcomingVisitSort(criteria: string): void {
    this.upcomingVisitSortBy = criteria;
    this.upcomingVisitSortDirection[criteria] = !this.upcomingVisitSortDirection[criteria];
    this.sortUpcomingVisits();
  }

  sortUpcomingVisits(): void {
    const direction = this.upcomingVisitSortDirection[this.upcomingVisitSortBy] ? 1 : -1;
    switch (this.upcomingVisitSortBy) {
      case 'date':
        this.upcomingVisits.sort((a, b) => direction * a.date.localeCompare(b.date));
        break;
      case 'username':
        this.upcomingVisits.sort((a, b) => direction * a.user.username.localeCompare(b.user.username));
        break;
      case 'note':
        this.upcomingVisits.sort((a, b) => direction * a.note.localeCompare(b.note));
        break;
      default:
        this.upcomingVisits.sort((a, b) => direction * a.date.localeCompare(b.date));
        break;
    }
  }

  getSortIcon(criteria: string, direction: boolean): string {
    if (direction) {
      return '&#x25b4';
    } else {
      return '&#x25be';
    }
  }




}
