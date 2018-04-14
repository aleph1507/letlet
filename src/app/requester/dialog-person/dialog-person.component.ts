import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Person } from '../../models/Person.model';


@Component({
  selector: 'app-dialog-person',
  templateUrl: './dialog-person.component.html',
  styleUrls: ['./dialog-person.component.css']
})
export class DialogPersonComponent implements OnInit {

  personForm: FormGroup;
  img1src: string = '';
  img2src: string = '';
  person: Person = {
    name: '',
    surname: '',
    image1: '',
    image2: ''
  };

  constructor(public thisDialogRef: MatDialogRef<DialogPersonComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.personForm = new FormGroup({
      'name': new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'surname': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'image1': new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'image2': new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'change'
      })
    })
  }

  previewImage(event){
    let elem = event.target || event.srcElement || event.currentTarget;
    if(elem.files.length > 0){
      let reader = new FileReader();
      reader.onload = (event:any) => {
        if(elem.attributes.formcontrolname.value == "image1")
          this.img1src = event.target.result;
        else
          this.img2src = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.cd.markForCheck();
    }
  }

  onSubmit(){
    this.person.name = this.personForm.controls['name'].value;
    this.person.surname = this.personForm.controls['surname'].value;
    this.person.image1 = this.img1src;
    this.person.image2 = this.img2src;
    this.thisDialogRef.close(this.person);
  }

  onCancel(){
    this.thisDialogRef.close("Cancel");
  }

  okAble(){
    return this.personForm.controls['name'].status === "VALID" &&
      this.personForm.controls['surname'].status === "VALID" && this.img1src != ''
      && this.img2src != '';
  }

}
