import { Component, OnInit } from '@angular/core';
import { Prescription } from './prescription.model';
import { PrescriptionService } from './prescription.service';
import { VisitService } from '../services/visit.service';
import { Visit } from '../visit/visit.model';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  visits: Visit[] = [];
  selectedVisitId: number | null = null;
  newPrescription: Prescription = { id: 0, telephone: '', note: '', visit: { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] } };

  constructor(private prescriptionService: PrescriptionService, private visitService: VisitService) { }

  ngOnInit(): void {
    this.getPrescriptions();
    this.getVisits();
  }

  getPrescriptions(): void {
    this.prescriptionService.getPrescriptions()
      .subscribe(prescriptions => this.prescriptions = prescriptions);
  }

  getVisits(): void {
    this.visitService.findAllVisits()
      .subscribe(visits => this.visits = visits);
  }

  addPrescription(): void {
    if (!this.newPrescription.visit?.id || !this.newPrescription.telephone.trim() || !this.newPrescription.note.trim()) {
      return;
    }

      const visitId = this.newPrescription.visit?.id;


      this.prescriptionService.addPrescription(visitId, this.newPrescription)
        .subscribe(prescription => {
          this.prescriptions.push(prescription);
          console.log('prescription added:', prescription);
          this.newPrescription = { id: 0, telephone: '', note: '', visit: { id: 0, date: '', hour: '', note: '', user: { id: 0, username: '', email: '', password: '', visits: [], roles:[] }, prescriptions: [] } };
        });
    }





  deletePrescription(prescription: Prescription): void {
    this.prescriptions = this.prescriptions.filter(s => s !== prescription);
    this.prescriptionService.deletePrescription(prescription).subscribe();
  }
/*
  updateprescription(prescription: prescription): void {
    this.prescriptionService.updateprescription(prescription, prescription.id)
      .subscribe(updatedprescription => {
        const index = this.prescriptions.findIndex(s => s.id === updatedprescription.id);
        if (index !== -1) {
          this.prescriptions[index] = updatedprescription;
        }
      });
  }
  */
}
