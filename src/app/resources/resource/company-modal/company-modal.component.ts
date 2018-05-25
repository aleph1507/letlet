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
    id: null,
    name: null
  };

  edit_mode = false;

  companyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CompanyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {id: number},
              private resourcesService: ResourcesService) { }

    ngOnInit() {
      if(this.data.id != null){
        this.resourcesService.companies.getCompanyById(this.data.id)
          .subscribe((data : Company) => {
            this.company = data;
            this.edit_mode = true;
            // console.log('data: ' + data.name);
            this.companyForm = new FormGroup({
              'name': new FormControl(this.company.name != null ? this.company.name : '', {
                validators: [Validators.required],
                updateOn: 'change'
              })
            });
          });
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
        this.resourcesService.companies.editCompany(this.company)
          .subscribe((data : Company) => {
            this.resourcesService.companies.switchCompany(data)
          });
      } else {
        this.resourcesService.companies.addCompany(this.company)
          .subscribe((data : Company) => {
            this.resourcesService.companies.pushCompany(data)
          });
      }
      this.dialogRef.close();
    }

    onCancel(): void {
      this.dialogRef.close();
    }
}
