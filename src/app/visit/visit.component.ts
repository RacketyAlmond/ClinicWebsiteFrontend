import { Component, OnInit } from '@angular/core';
import { Visit } from './visit.model';
import { VisitService } from '../services/visit.service';
import { User } from './user.model'; // Ensure this path matches your actual user model

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  visits: Visit[] = [];
  newVisit: Visit = { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] };

  constructor(private visitService: VisitService) {}

  ngOnInit(): void {
    this.getVisits();
  }

  getVisits(): void {
    this.visitService.findAllVisits()
      .subscribe(visits => this.visits = visits);
  }

  addVisit(): void {
    if (!this.newVisit.user?.id || !this.newVisit.date.trim() || !this.newVisit.note.trim()) {
      return;
    }

    const userId = this.newVisit.user.id;

    this.visitService.addVisit(userId, this.newVisit) // Pass userId as the first argument
      .subscribe((visit: Visit) => {
        this.visits.push(visit);
        this.newVisit = { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] };
      });
  }

  deleteVisit(visit: Visit): void {
    this.visits = this.visits.filter(v => v !== visit);
    this.visitService.deleteVisiter(visit).subscribe();
  }

  // Function to set the selected user for new visit
  setSelectedUser(user: User): void {
    this.newVisit.user = user;
  }
}
