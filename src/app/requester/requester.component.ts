import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { Requester } from '../models/Requester.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-requester',
  templateUrl: './requester.component.html',
  styleUrls: ['./requester.component.css']
})
export class RequesterComponent implements OnInit {

  companies = [
    {
      name: 'AMC'
    },
    {
      name: 'BBC'
    },
    {
      name: 'TAV'
    },
    {
      name: 'DrinkLab'
    }
  ];

  persons: Person[] = [];

  filteredCompanies: Observable<any[]>;

  requesterForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.requesterForm = new FormGroup({
      requesterName: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      requesterDescription: new FormControl('', {
        updateOn: 'change'
      }),
      requesterCompany: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      requesterFromDate: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      requesterToDate: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      requesterNumOfEntries: new FormControl('', {
        validators: [Validators.required, this.intValidator]
      })
    })

    this.filteredCompanies = this.requesterForm.controls['requesterCompany'].valueChanges
      .pipe(
        startWith(''),
        map(company => company ? this.filterCompanies(company) : this.companies.slice())
      )
    this.requesterForm.controls['requesterCompany']
  }

  filterCompanies(name: string) {
    return this.companies.filter(
      company => company.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  intValidator(control: FormControl) {
    return isNaN(control.value) ? { "error": "NaN" } : null;
  }

}
