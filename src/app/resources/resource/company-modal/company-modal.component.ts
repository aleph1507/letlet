import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Company } from '../../../models/Company';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.css']
})
export class CompanyModalComponent implements OnInit {

  company: Company = {
    id: null,
    name: null,
    nameEn: null
  };

  edit_mode = false;

  companyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CompanyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {id: number},
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService) { }

    ngOnInit() {
      if(this.data.id != null){
        this.resourcesService.companies.getCompanyById(this.data.id)
          .subscribe((data : Company) => {
            this.company = data;
            this.edit_mode = true;
            this.companyForm = new FormGroup({
              'name': new FormControl(this.company.name != null ? this.company.name : '', {
                validators: [Validators.required],
                updateOn: 'change'
              }),
              'nameEn': new FormControl(this.company.nameEn != null ? this.company.nameEn : '', {
                validators: [Validators.required],
                updateOn: 'change'
              })
            });
          });
      } else {
        this.edit_mode = false;
      }

      this.companyForm = new FormGroup({
        'name': new FormControl(this.company ? this.company.name : '', {
          validators: [Validators.required],
          updateOn: 'change'
        }),
        'nameEn': new FormControl(this.company ? this.company.nameEn : '', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      });

    }

    onSubmit() {
      this.company.name = this.companyForm.controls['name'].value;
      this.company.nameEn = this.companyForm.controls['nameEn'].value;
      if(this.edit_mode){
        this.resourcesService.companies.editCompany(this.company)
          .subscribe((data : Company) => {
            this.resourcesService.companies.switchCompany(data)
            this.snackbarService.successSnackBar("Company successfully updated");
          });
      } else {
        this.resourcesService.companies.addCompany(this.company)
          .subscribe((data : Company) => {
            this.resourcesService.companies.pushCompany(data);
            this.snackbarService.successSnackBar("Company successfully added");

          });
      }
      this.dialogRef.close();
    }

    onCancel(): void {
      this.dialogRef.close();
    }
}
