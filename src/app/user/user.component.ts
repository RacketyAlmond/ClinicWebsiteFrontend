import { Component, OnInit } from '@angular/core';
import { VisitService } from '../services/visit.service';
import { Visit } from 'src/app/visit/visit.model';
import { PrescriptionService } from '../prescriptions/prescription.service';
import { Prescription } from '../prescriptions/prescription.model';
import { UserService } from "../services/user.service";
import {TokenStorageService} from "../auth/token-storage.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  prescriptionList: Prescription[] = [];
  filteredprescriptions: Prescription[] = [];
  visits: Visit[] = [];
  pastVisits: Visit[] = [];
  upcomingVisits: Visit[] = [];
  searchTermPast: string = '';

  username: string = '';
  email: string = '';
  sortBy: string = 'date';
  prescriptionSortBy: string = 'surname';
  sortDirection: { [key: string]: boolean } = { date: true, username: true };
  prescriptionSortDirection: { [key: string]: boolean } = { surname: true, telephone: true };
  searchTerm: string = '';
  prescriptionSearchTerm: string = '';

  filteredVisits: Visit[] = [];


  constructor(private visitService: VisitService, private prescriptionService: PrescriptionService, private userService: UserService, private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.getUsername();
  }

  getUsername(): void {
    this.email = this.tokenStorageService.getUsername();
    this.username = this.tokenStorageService.getEmail();//username;
    console.log("username is ");
    console.log(this.username);
    this.getVisits();
    this.getprescriptions();
  }

  getVisits(): void {
    this.visitService.findAllVisits().subscribe(data => {
      this.visits = data.filter(visit => visit.user.email === this.username);
      const now = new Date();
      this.pastVisits = this.visits.filter(visit => new Date(visit.date) < now);
      this.upcomingVisits = this.visits.filter(visit => new Date(visit.date) >= now);
      this.filteredVisits = [...this.visits];
      this.sortVisits();
    }, error => {
      console.error('Error fetching visits:', error);
    });
  }

  getprescriptions(): void {
    this.prescriptionService.getPrescriptions().subscribe(data => {
      this.prescriptionList = data.filter(prescription => prescription.visit.user.email === this.username);
      this.filteredprescriptions = [...this.prescriptionList];
      this.sortprescriptions();
    }, error => {
      console.error('Error fetching prescriptions:', error);
    });
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
      visit.date.toLowerCase().includes(searchTermLower) ||
      visit.note.toLowerCase().includes(searchTermLower)

  );
  }


  toggleSort(criteria: string): void {
    this.sortBy = criteria;
    this.sortDirection[criteria] = !this.sortDirection[criteria];
    this.sortVisits();
  }

  sortVisits(): void {
    const direction = this.sortDirection[this.sortBy] ? 1 : -1;
    switch (this.sortBy) {
      case 'date':
        this.filteredVisits.sort((a: Visit, b: Visit) => direction * (new Date(a.date).getTime() - new Date(b.date).getTime()));
        break;
      case 'username':
        this.filteredVisits.sort((a: Visit, b: Visit) => direction * a.user.username.localeCompare(b.user.username));
        break;
      default:
        this.filteredVisits.sort((a: Visit, b: Visit) => direction * (new Date(a.date).getTime() - new Date(b.date).getTime()));
        break;
    }
  }

  filterVisits(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredVisits = this.visits.filter(visit =>
      visit.user.username.toLowerCase().includes(searchTermLower) ||
      visit.user.email.toLowerCase().includes(searchTermLower) ||
      visit.date.toLowerCase().includes(searchTermLower) ||
      visit.note.toLowerCase().includes(searchTermLower)
    );
  }

  toggleprescriptionSort(criteria: string): void {
    this.prescriptionSortBy = criteria;
    this.prescriptionSortDirection[criteria] = !this.prescriptionSortDirection[criteria];
    this.sortprescriptions();
  }

  sortprescriptions(): void {
    const direction = this.prescriptionSortDirection[this.prescriptionSortBy] ? 1 : -1;
    switch (this.prescriptionSortBy) {
      case 'surname':
        this.filteredprescriptions.sort((a: Prescription, b: Prescription) => direction * a.visit.user.username.localeCompare(b.visit.user.username));
        break;
      case 'telephone':
        this.filteredprescriptions.sort((a: Prescription, b: Prescription) => direction * a.telephone.localeCompare(b.telephone));
        break;
      default:
        this.filteredprescriptions.sort((a: Prescription, b: Prescription) => direction * a.visit.user.username.localeCompare(b.visit.user.username));
        break;
    }
  }

  filterprescriptions(): void {
    const searchTermLower = this.prescriptionSearchTerm.toLowerCase();
    this.filteredprescriptions = this.prescriptionList.filter(prescription =>
      prescription.visit.user.username.toLowerCase().includes(searchTermLower) ||
      prescription.visit.user.email.toLowerCase().includes(searchTermLower) ||
      prescription.telephone.toLowerCase().includes(searchTermLower)
    );
  }
  getSortIcon(criteria: string, direction: boolean): string {
    if (direction) {
      return '&#x25b4';
    } else {
      return '&#x25be';
    }
  }
}
