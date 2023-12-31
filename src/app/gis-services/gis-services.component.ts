import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import data from '@assets/properties/gis-services-data.json';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-gis-services',
  templateUrl: './gis-services.component.html',
  styleUrls: ['./gis-services.component.scss']
})
export class GisServicesComponent implements OnInit {
  requiredForm: FormGroup;
  active = 1;
  notificationModalPositive;
  // myForm: FormGroup;

  private gisItems = data["gisItems"];
  private dpItems = data["dpItems"];
  private uavItems = data["uavItems"];
  private alItems = data["alItems"];

  formData = { name: '', /* other form fields */ };


  ngOnInit(): void {

  }
  constructor(private emailService: EmailService, private fb: FormBuilder, private modalService: NgbModal) {
    this.myForm();
  }

  myForm() {
    this.requiredForm = this.fb.group({
      name: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      agreementChecked: [false, [Validators.requiredTrue]]
    });
  }

  markFormFieldsAsTouched() {
    Object.values(this.requiredForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  sendEmail(content) {
    if (!this.requiredForm.valid) {
      this.markFormFieldsAsTouched();
    } else {
      const subject = 'Questions on GIS - Services';
      const bodyHtml = '<p> Name : ' + this.requiredForm.value.name + '</p> <br>'
        + '<p> Mail : ' + this.requiredForm.value.email + '</p> <br>'
        + '<p> Telephone : ' + this.requiredForm.value.phoneNumber + '</p> <br>'
        + '<p> Message : ' + this.requiredForm.value.message + '</p> <br>';

      this.emailService
        .sendEmail(subject, bodyHtml, null)
        .subscribe(
          (response) => {
            if (response.success) {
              this.openModal(content, true);
              console.log('Email sent successfully' + JSON.stringify(response));
            }
            else {
              this.openModal(content, false);
              console.log('Error sending email from the response');
            }
          },
          (error) => {
            this.openModal(content, false);
            console.log('Error sending email' + error);
          }
        );
    }
  }


  openModal(content, isPositive) {
    this.notificationModalPositive = isPositive;
    this.modalService.open(content, { windowClass: 'modal-mini', centered: true }).result.then((result) => {
      console.log(`Closed with: ${result}`);
      if (this.notificationModalPositive) {
        this.requiredForm.reset();
      }
    }, (reason) => {
      if (this.notificationModalPositive) {
        this.requiredForm.reset();
      }
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
