import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Person } from '../../models/Person.model';
import { RequesterService } from '../../services/requester.service';


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
    nameEn: '',
    name: '',
    surnameEn: '',
    surname: '',
    image1: '',
    image2: ''
  };

  constructor(public thisDialogRef: MatDialogRef<DialogPersonComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {person, i},
              private requesterService: RequesterService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {

    if(this.data !== null){
      this.person = this.data.person;
  //     this.personForm = new FormGroup({
  //       'name': new FormControl(this.person.nameEn, {
  //         validators: [Validators.required],
  //         // updateOn: 'change'
  //       }),
  //       'nameCyrilic': new FormControl(this.person.surname, {
  //         validators: [Validators.required],
  //         // updateOn: 'change'
  //       }),
  //       'surname': new FormControl(this.person.surnameEn, {
  //         validators: Validators.required,
  //         // updateOn: 'change'
  //       }),
  //       'surnameCyrilic': new FormControl(this.person.surname, {
  //         validators: Validators.required,
  //         // updateOn: 'change'
  //       })
  //     })
  //   } else {
  //   this.personForm = new FormGroup({
  //     'name': new FormControl(this.person.nameEn, {
  //       validators: [Validators.required],
  //       // updateOn: 'change'
  //     }),
  //     'nameCyrilic': new FormControl(this.person.surname, {
  //       validators: [Validators.required],
  //       // updateOn: 'change'
  //     }),
  //     'surname': new FormControl(this.person.surnameEn, {
  //       validators: Validators.required,
  //       // updateOn: 'change'
  //     }),
  //     'surnameCyrilic': new FormControl(this.person.surname, {
  //       validators: Validators.required,
  //       // updateOn: 'change'
  //     })
  //   })
  }

    this.personForm = new FormGroup({
      'name': new FormControl(this.person.nameEn, {
        validators: [Validators.required],
        // updateOn: 'change'
      }),
      'nameCyrilic': new FormControl(this.person.surname, {
        validators: [Validators.required],
        // updateOn: 'change'
      }),
      'surname': new FormControl(this.person.surnameEn, {
        validators: Validators.required,
        // updateOn: 'change'
      }),
      'surnameCyrilic': new FormControl(this.person.surname, {
        validators: Validators.required,
        // updateOn: 'change'
      }),
      // 'image1': new FormControl(null, {
      //   updateOn: 'change'
      // }),
      // 'image2': new FormControl(null, {
      //   updateOn: 'change'
      // })
    })
  }

  // previewImage(event){
  //   let elem = event.target || event.srcElement || event.currentTarget;
  //   if(elem.files.length > 0){
  //     let reader = new FileReader();
  //     reader.onload = (event:any) => {
  //       if(elem.attributes.formcontrolname.value == "image1")
  //         this.img1src = event.target.result;
  //       else
  //         this.img2src = event.target.result;
  //     }
  //     reader.readAsDataURL(event.target.files[0]);
  //     this.cd.markForCheck();
  //   }
  // }

  latinOnly(event) {
    var regex = /[^a-z\s]/gi;
    event.target.value = event.target.value.replace(regex, '');
  }

  cyrilicOnly(event) {
    // var regex = /[^а-з\s]/gi;
    var regex = /[^АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШабвгдѓежзѕијклљмнњопрстќуфхцчџш\s]/g;
    event.target.value = event.target.value.replace(regex, '');
  }

  onSubmit(){
    this.person.nameEn = this.personForm.controls['name'].value;
    this.person.name = this.personForm.controls['nameCyrilic'].value;
    this.person.surnameEn = this.personForm.controls['surname'].value;
    this.person.surname = this.personForm.controls['surnameCyrilic'].value;
    // this.person.image1 = this.img1src;
    // this.person.image2 = this.img2src;
    this.data === null ? this.requesterService.addPerson(this.person) : this.requesterService.editPerson(this.data.i, this.person);
    // this.requesterService
    this.thisDialogRef.close();
  }

  onCancel(){
    this.thisDialogRef.close();
  }

  okAble(){
    // console.log(!/[^a-z\s]/.test(this.personForm.controls['name'].value) + ' latin name test');
    // console.log(!/[^a-z\s]/.test(this.personForm.controls['surname'].value) + ' latin surname test');
    // console.log(!/[^АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШабвгдѓежзѕијклљмнњопрстќуфхцчџш\s]/.test(this.personForm.controls['nameCyrilic'].value) + ' cyrilic name test');
    // console.log(!/[^АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШабвгдѓежзѕијклљмнњопрстќуфхцчџш\s]/.test(this.personForm.controls['surnameCyrilic'].value) + ' cyrilic surname test');
    return this.personForm.controls['name'].status === "VALID" &&
      this.personForm.controls['surname'].status === "VALID" &&
      this.personForm.controls['nameCyrilic'].status === "VALID" &&
      this.personForm.controls['surnameCyrilic'].status === 'VALID' &&
      this.personForm.controls['name'].value != '' &&
      this.personForm.controls['surname'].value != '' &&
      this.personForm.controls['nameCyrilic'].value != '' &&
      this.personForm.controls['surnameCyrilic'].value != '' &&
      this.personForm.controls['name'].value != null &&
      this.personForm.controls['surname'].value != null &&
      this.personForm.controls['nameCyrilic'].value != null &&
      this.personForm.controls['surnameCyrilic'].value != null &&
      !/[^a-z\s]/gi.test(this.personForm.controls['name'].value) &&
      !/[^a-z\s]/gi.test(this.personForm.controls['surname'].value) &&
      !/[^АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШабвгдѓежзѕијклљмнњопрстќуфхцчџш\s]/g.test(this.personForm.controls['nameCyrilic'].value) &&
      !/[^АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШабвгдѓежзѕијклљмнњопрстќуфхцчџш\s]/g.test(this.personForm.controls['surnameCyrilic'].value);
       //&& this.img1src != '' && this.img2src != '';
  }

}
