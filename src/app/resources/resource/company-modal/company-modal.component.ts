import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Company } from '../../../models/Company';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.css']
})
export class CompanyModalComponent implements OnInit {

  company: Company = {
    id: -1,
    name: ''
  };

  edit_mode = false;

  companyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CompanyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {id: number},
              private resourcesService: ResourcesService) { }

    ngOnInit() {
      // console.log('data: ', this.data);
      if(this.data.id != null){
        this.company = this.resourcesService.companies.getCompanyById(this.data.id);
        this.edit_mode = true;
      } else {
        this.edit_mode = false;
      }

      this.companyForm = new FormGroup({
        // 'id': new FormControl(this.company.id, {
        //   validators: [Validators.required],
        //   updateOn: 'change'
        // }),
        'name': new FormControl(this.company ? this.company.name : '', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      });

    }

    onSubmit() {
      console.log('edit_mode: ', this.edit_mode);
      this.company.name = this.companyForm.controls['name'].value;
      if(this.edit_mode){
        this.resourcesService.companies.editCompany(this.data.id, this.companyForm.controls['name'].value);
      }else {
        this.company.id = this.resourcesService.companies.getCompanies().length + 1;
        this.resourcesService.companies.addCompany(this.company);
      }
      this.dialogRef.close();
    }

    onCancel(): void {
      this.dialogRef.close();
    }
}
