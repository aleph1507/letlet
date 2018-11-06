import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { Requester } from '../models/Requester.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { DialogPersonComponent } from './dialog-person/dialog-person.component';
import { DialogVehicleComponent } from './dialog-vehicle/dialog-vehicle.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import "rxjs/add/observable/of";
import { RequesterService } from '../services/requester.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResourcesService } from '../services/resources.service';
import { DatePipe } from '@angular/common';
import { Company } from '../models/Company';
import { DomSanitizer } from '@angular/platform-browser';
import { SuccessToastComponent } from '../shared/success-toast/success-toast.component';
import { SnackbarService } from '../services/snackbar.service';
import { AsptonormaldatePipe } from '../shared/pipes/asptonormaldate.pipe';
import { AuthService } from '../services/auth.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-requester',
  templateUrl: './requester.component.html',
  styleUrls: ['./requester.component.css']
})
export class RequesterComponent implements OnInit, OnDestroy {

  hoveredEditPerson = false;

  nEntries = [];
  errorString: string = '';
  missingImages: boolean;

  companies = [];

  displayedPersonColumns = ['name', 'surname'];
  displayedVehicleColumns = ['model', 'plate'];

  filteredCompanies: Observable<string[]>;

  requesterForm: FormGroup;
  request = new Requester();

  validForm = true;
  editMode: boolean = false;

  paramsSub: any;
  id: number = null;

  reqCompany : Company;

  todayDate;
  showApproveBtn : boolean = false;
  showDeclineBtn : boolean = false;

  pdf1src: Blob;
  pdf2src: Blob;
  pdf1filename: string = '';
  pdf2filename: string = '';

  companiesAutoCtrl: FormControl = new FormControl();
  companies_auto: Company[] = [];

  personPay: boolean = true;
  vehiclePay: boolean = true;

  showPersonsSpinner: boolean = false;
  showVehiclesSpinner: boolean = false;
  showRequestSpinner: boolean = false;

  companyOk: boolean = this.companiesAutoCtrl.value == null ? false : (this.companiesAutoCtrl.value.id == undefined ? false : true);

  constructor(private dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              public requesterService: RequesterService,
              private route: ActivatedRoute,
              private resources: ResourcesService,
              private datePipe: DatePipe,
              private router: Router,
              private sanitizer: DomSanitizer,
              public snackBar: MatSnackBar,
              public snackbarService: SnackbarService,
              public authService: AuthService
            ) { }

  ngOnInit() {
      this.companiesAutoCtrl.valueChanges
        .subscribe(d => {
          this.resources.companies.filterCompanies(d)
            .subscribe((data: Company[]) => {
              this.companies_auto = data;
              this.companyOk = this.companiesAutoCtrl.value == null ? false :
                (this.companiesAutoCtrl.value.id == undefined ? false : true);
            });
        });

    for(let i = 1; i<= 15; i++)
      this.nEntries.push({name: i.toString(), value: i});

    this.nEntries.push({name: 'Unlimited', value: -1});

    this.requesterService.setPersons([]);
    this.requesterService.setVehicles([]);
    this.requesterForm = new FormGroup({
      'requesterName': new FormControl(this.request.requesterName, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'contactEmail': new FormControl(this.request.contactEmail, {}),
      'contactPhone': new FormControl(this.request.contactPhone, {
        validators: Validators.required,
      }),
      'requesterDescription': new FormControl(this.request.description, {
        updateOn: 'change'
      }),
      'requesterDescriptionEn': new FormControl(this.request.descriptionEn, {
        updateOn: 'change'
      }),
      'requesterFromDate': new FormControl(this.request.fromDate, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterToDate': new FormControl(this.request.toDate, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterNumOfEntries': new FormControl(this.request.numberOfEntries, {
        validators: [Validators.required]
      }),
      'pdf1': new FormControl(null, {
        updateOn: 'change'
      }),
      'pdf2': new FormControl(null, {
        updateOn: 'change'
      })
    })
// pdf > 28

    this.paramsSub = this.route.params.subscribe(params => {
      if(params['id']){
        this.showRequestSpinner = true;
        this.requesterService.getRequest(+params['id'])
          .subscribe((req : Requester) => {
            this.id = req.id;
            this.editMode = true;
            this.request = req;
            this.pdf1src = req.pdf1;
            this.pdf2src = req.pdf2;
            this.personPay = req.personPay;
            this.vehiclePay = req.vehiclePay;
            this.requesterService.setPersons(req.requestPersonJson);
            this.requesterService.setVehicles(req.requestVehicleJson);
            let company = null;
            this.resources.companies.getCompanyById(this.request.companyId)
              .subscribe((c : Company) => {
                this.companiesAutoCtrl.setValue(c);
                this.requesterForm = new FormGroup({
                  'requesterName': new FormControl(this.request.requesterName),
                  'contactEmail': new FormControl(this.request.contactEmail),
                  'contactPhone': new FormControl(this.request.contactPhone),
                  'requesterDescription': new FormControl(this.request.description),
                  'requesterDescriptionEn': new FormControl(this.request.descriptionEn),
                  'requesterFromDate': new FormControl(this.request.fromDate),
                  'requesterToDate': new FormControl(this.request.toDate),
                  'requesterNumOfEntries': new FormControl(this.request.numberOfEntries),
                  'pdf1': new FormControl(null, {
                    updateOn: 'change'
                  }),
                  'pdf2': new FormControl(null, {
                    updateOn: 'change'
                  })
                });
                this.requesterForm.getRawValue();
              });
              this.request.approved ? this.showDeclineBtn = true : this.showApproveBtn = true;
              this.showRequestSpinner = false;
          })
      }

      this.todayDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    });
  }

  cyrilicOnly(event) {
    var regex = /[^АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШабвгдѓежзѕијклљмнњопрстќуфхцчџш\s]/g;
    event.target.value = event.target.value.replace(regex, '');
  }

  latinOnly(event) {
    var regex = /[^a-z\s]/gi;
    event.target.value = event.target.value.replace(regex, '');
  }

   b64toBlob(b64Data, contentType = 'application/pdf', sliceSize = 512) {
    contentType = contentType || 'application/pdf';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  pdfToBlob(b64pdf: string){
    if(b64pdf == null)
      return;
    let blob = this.b64toBlob(b64pdf.slice(28, b64pdf.length));
    return URL.createObjectURL(blob);
  }

  sanitizeURL(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  savePdf(event){
    let elem = event.target || event.srcElement || event.currentTarget;
    if(elem.files.length > 0){
      let name = event.target.files[0].name;
      let reader = new FileReader();
      reader.onload = (event:any) => {
        if(elem.attributes.formcontrolname.value == "pdf1"){
          // this.pdf1src = event.target.result;
          this.pdf1filename = name;
        }
        else{
          // this.pdf2src = event.target.result;
          // console.log('pdf2src: ', this.pdf2src);
          this.pdf2filename = name;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
      this.changeDetectorRef.markForCheck();
    }
  }

  getPdf(which, rid){
    this.requesterService.getPdf(which, rid)
      .subscribe((res) => {
      });
  }

  getPdfV2(which, rid){
    var popup = window.open("");
    popup.document.open();
    popup.document.write("Loading ...");

    this.requesterService.getPdfV2(which, rid)
      .subscribe((res) => {
        var file = new Blob([res], {type: "application/pdf"});
        var fileURL = window.URL.createObjectURL(file);
        popup.location.href = fileURL;
        popup.document.close();
      });
  }

  displayFn(c?: Company) {
    return c ? c.name : undefined;
  }

  approve(id: number){
    this.requesterService.approveRequest(id).subscribe(
      (data: boolean) => {
        data ? this.router.navigate(['/approvals', 3], { queryParams: {'sb': 's'} }) : this.router.navigate(['/approvals', 3], { queryParams: {'sb': 's'} });
      }
    );
  }

  decline(id: number){
    this.requesterService.declineRequest(id).subscribe(
      (data: boolean) => {
        data ? this.router.navigate(['/approvals', 2], { queryParams: {'sb': 's'} }) : this.router.navigate(['/approvals', 2], { queryParams: {'sb': 's'} });
      }
    );
  }

  imagesCheck() {
    if(!this.pdf1src){
      return this.checkPersons() || this.checkVehicles() ? true : false;
    } else if(this.pdf1src.size < 1 || this.pdf1src == null || this.pdf1src == undefined) {
      return this.checkPersons() || this.checkVehicles() ? true : false;
    } else {
      return this.requesterService.isEmptyPersons();
    }
  }

  checkPersons() {
    if(this.requesterService.isEmptyPersons())
      return true;

    let persons: Person[] = this.requesterService.getAllPersons();

    for(let i = 0; i<persons.length; i++){
      if(persons[i].image1 == '' || persons[i].image1 == null || persons[i].image1 == undefined ||
        persons[i].image2 == '' || persons[i].image2 == null || persons[i].image2 == undefined){
          this.errorString += `\nPerson ${persons[i].name} ${persons[i].surname} is missing images.`;
          this.missingImages = true;
          return true;
        }
    }
    return false;
  }

  checkVehicles() {
    let vehicles:Vehicle[] = this.requesterService.getAllVehicles();
    for(let i = 0; i<vehicles.length; i++){
      if(vehicles[i].image1 == '' || vehicles[i].image1 == null || vehicles[i].image1 == undefined ||
        vehicles[i].image2 == '' || vehicles[i].image2 == null || vehicles[i].image2 == undefined){
          this.errorString += `\nVehicle ${vehicles[i].plate} of model ${vehicles[i].model} is missing images.`;
          this.missingImages = true;
          return true;
        }
    }
    return false;
  }

  editRequest() {
    console.log('vo component editRequest');
    console.log('this.requesterForm: ', this.requesterForm);
    if(this.requesterForm.valid) {
      console.log('vo prv if');
      if(this.editMode){
        this.resources.companies.getCompanyById(this.request.companyId)
          .subscribe((data : Company) => {
            this.reqCompany = data;
          });

      let fromDate = this.requesterForm.controls['requesterFromDate'].value;
      let toDate = this.requesterForm.controls['requesterToDate'].value;
      fromDate.setDate(fromDate.getDate() + 1);
      toDate.setDate(toDate.getDate() + 1);
      let pdf1 = <HTMLInputElement>document.getElementById('pdf1');
      let pdf2 = <HTMLInputElement>document.getElementById('pdf2');

      let formData = new FormData();
      formData.append('requesterName', this.requesterForm.controls['requesterName'].value);
      formData.append('contactEmail', this.requesterForm.controls['requesterName'].value);
      formData.append('contactPhone', this.requesterForm.controls['contactPhone'].value);
      formData.append('requesterDescription', this.requesterForm.controls['requesterDescription'].value);
      formData.append('requesterDescriptionEn', this.requesterForm.controls['requesterDescriptionEn'].value);
      formData.append('companyId', this.companiesAutoCtrl.value.id);
      formData.append('fromDate', fromDate);
      formData.append('toDate', toDate);
      formData.append('pdf1', pdf1.files[0], 'pdf1.pdf');
      formData.append('pdf2', pdf2.files[0], 'pdf2.pdf');
      formData.append('personPay', this.personPay.toString());
      formData.append('vehiclePay', this.vehiclePay.toString());
      let id = this.request.id;

        // let fd : string = this.requesterForm.controls['requesterFromDate'].value;
        // let fromDate = new Date(fd);
        // console.log('fromDate pred setDate: ', fromDate);
        // fromDate.setHours(12,0,0);
        // //fromDate.setDate(fromDate.getDate()+1);
        // console.log('fromDate posle setDate: ', fromDate);
        // let td : string = this.requesterForm.controls['requesterToDate'].value;
        // let toDate = new Date(td);
        // console.log('toDate pred setDate: ', toDate);
        // toDate.setHours(12,0,0);
        // //toDate.setDate(toDate.getDate()+1);
        // console.log('toDate posle setDate: ', toDate);
        // this.request.requesterName = this.requesterForm.controls['requesterName'].value;
        // this.request.contactEmail = this.requesterForm.controls['contactEmail'].value;
        // this.request.contactPhone = this.requesterForm.controls['contactPhone'].value;
        // this.request.description = this.requesterForm.controls['requesterDescription'].value;
        // this.request.descriptionEn = this.requesterForm.controls['requesterDescriptionEn'].value;
        // this.request.companyId = this.companiesAutoCtrl.value.id;
        // this.request.fromDate = fromDate;
        // this.request.toDate = toDate;
        // this.request.numberOfEntries = this.requesterForm.controls['requesterNumOfEntries'].value;
        // this.request.personPay = this.personPay;
        // this.request.vehiclePay = this.vehiclePay;
        // if(this.pdf1src != null)
        //   this.request.pdf1 = this.pdf1src;
        // if(this.pdf2src != null)
        //   this.request.pdf2 = null;
        let o_request = this.request;
        // console.log('pred service editRequest.subscribe');
        this.requesterService.editRequest(formData, id).subscribe((data: Requester) => {
          this.requesterService.switchRequest(o_request, data);
          this.snackbarService.msg = 'Промените се зачувани';
          this.snackbarService.successSnackBar();
        });

      }
    }
  }

  successSnackBar() {
    this.snackBar.openFromComponent(SuccessToastComponent, {
      duration: 1500,
    });
  }

  onSubmit() {
    if(this.requesterForm.valid) {
      if(this.editMode){
        this.resources.companies.getCompanyById(this.request.companyId)
          .subscribe((data : Company) => {
            this.reqCompany = data;
          });

        let fromDate = this.requesterForm.controls['requesterFromDate'].value;
        let toDate = this.requesterForm.controls['requesterToDate'].value;
        fromDate.setDate(fromDate.getDate() + 1);
        toDate.setDate(toDate.getDate() + 1);
        let pdf1 = <HTMLInputElement>document.getElementById('pdf1');
        let pdf2 = <HTMLInputElement>document.getElementById('pdf2');

        let formData = new FormData();
        formData.append('requesterName', this.requesterForm.controls['requesterName'].value);
        formData.append('contactEmail', this.requesterForm.controls['requesterName'].value);
        formData.append('contactPhone', this.requesterForm.controls['contactPhone'].value);
        formData.append('requesterDescription', this.requesterForm.controls['requesterDescription'].value);
        formData.append('requesterDescriptionEn', this.requesterForm.controls['requesterDescriptionEn'].value);
        formData.append('companyId', this.companiesAutoCtrl.value.id);
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
        formData.append('pdf1', pdf1.files[0], 'pdf1.pdf');
        formData.append('pdf2', pdf2.files[0], 'pdf2.pdf');
        formData.append('personPay', this.personPay.toString());
        formData.append('vehiclePay', this.vehiclePay.toString());
        for(let i = 0; i<this.requesterService.persons.length; i++){
          formData.append('person' + i + 'name', this.requesterService.persons[i].name);
          formData.append('person' + i + 'nameEn', this.requesterService.persons[i].nameEn);
          formData.append('person' + i + 'surname', this.requesterService.persons[i].surname);
          formData.append('person' + i + 'surnameEn', this.requesterService.persons[i].surnameEn);
        }
        for(let i = 0; i<this.requesterService.vehicles.length; i++){
          formData.append('vehicle' + i + 'model', this.requesterService.vehicles[i].model);
          formData.append('vehicle' + i + 'plate', this.requesterService.vehicles[i].plate);
        }
        let id = this.request.id;

        // this.request.requesterName = this.requesterForm.controls['requesterName'].value;
        // this.request.contactEmail = this.requesterForm.controls['contactEmail'].value;
        // this.request.contactPhone = this.requesterForm.controls['contactPhone'].value;
        // this.request.description = this.requesterForm.controls['requesterDescription'].value;
        // this.request.descriptionEn = this.requesterForm.controls['requesterDescriptionEn'].value;
        // this.request.companyId = this.companiesAutoCtrl.value.id;
        // this.request.fromDate = this.requesterForm.controls['requesterFromDate'].value;
        // this.request.fromDate.setDate(this.request.fromDate.getDate() + 1);
        // this.request.toDate = this.requesterForm.controls['requesterToDate'].value;
        // this.request.toDate.setDate(this.request.toDate.getDate() + 1);
        // this.request.numberOfEntries = this.requesterForm.controls['requesterNumOfEntries'].value;
        // this.request.pdf1 = this.pdf1src;
        // this.request.pdf2 = this.pdf2src;
        // this.request.personPay = this.personPay;
        // this.request.vehiclePay = this.vehiclePay;
        this.requesterService.editRequest(formData, id);
        this.router.navigate(['/approvals', 1]);
      } else {
        let fromDate = this.requesterForm.controls['requesterFromDate'].value;
        let toDate = this.requesterForm.controls['requesterToDate'].value;
        fromDate.setDate(fromDate.getDate() + 1);
        toDate.setDate(toDate.getDate() + 1);
        let pdf1 = <HTMLInputElement>document.getElementById('pdf1');
        let pdf2 = <HTMLInputElement>document.getElementById('pdf2');

        let formData = new FormData();
        let reqForm = {
          'requesterName' : this.requesterForm.controls['requesterName'].value,
          'contactEmail' : this.requesterForm.controls['contactEmail'].value,
          'contactPhone' : this.requesterForm.controls['contactPhone'].value,
          'requesterDescription' : this.requesterForm.controls['requesterDescription'].value,
          'requesterDescriptionEn' : this.requesterForm.controls['requesterDescriptionEn'].value,
          'companyId' : this.companiesAutoCtrl.value.id,
          'fromDate' : fromDate,
          'toDate' : toDate,
          'personPay' : this.personPay.toString(),
          'vehiclePay' : this.vehiclePay.toString()
        }
        // formData.append('requesterName', this.requesterForm.controls['requesterName'].value);
        // formData.append('contactEmail', this.requesterForm.controls['contactEmail'].value);
        // formData.append('contactPhone', this.requesterForm.controls['contactPhone'].value);
        // formData.append('requesterDescription', this.requesterForm.controls['requesterDescription'].value);
        // formData.append('requesterDescriptionEn', this.requesterForm.controls['requesterDescriptionEn'].value);
        // formData.append('companyId', this.companiesAutoCtrl.value.id);
        // formData.append('fromDate', fromDate);
        // formData.append('toDate', toDate);
        formData.append('pdf1', pdf1.files[0], 'pdf1.pdf');
        formData.append('pdf2', pdf2.files[0], 'pdf2.pdf');
        // formData.append('personPay', this.personPay.toString());
        // formData.append('vehiclePay', this.vehiclePay.toString());

        let persons = JSON.stringify(this.requesterService.persons);
        let vehicles = JSON.stringify(this.requesterService.vehicles);

        formData.append('reqForm', JSON.stringify(reqForm));
        formData.append('persons', persons);
        formData.append('vehicles', vehicles);

        // for(let i = 0; i<this.requesterService.persons.length; i++){
        //   formData.append('person' + i + 'name', this.requesterService.persons[i].name);
        //   formData.append('person' + i + 'nameEn', this.requesterService.persons[i].nameEn);
        //   formData.append('person' + i + 'surname', this.requesterService.persons[i].surname);
        //   formData.append('person' + i + 'surnameEn', this.requesterService.persons[i].surnameEn);
        // }
        // for(let i = 0; i<this.requesterService.vehicles.length; i++){
        //   formData.append('vehicle' + i + 'model', this.requesterService.vehicles[i].model);
        //   formData.append('vehicle' + i + 'plate', this.requesterService.vehicles[i].plate);
        // }

        this.requesterService.pushRequest(null, formData)
        .subscribe((data: Requester) => {
          this.requesterService.requests.push(data);
          this.router.navigate(['/approvals', 1], { queryParams: {'sb': 's'} });
        });

        // this.reqCompany = this.companiesAutoCtrl.value;
        // let fromDate : Date = this.requesterForm.controls['requesterFromDate'].value;
        // fromDate.setDate(fromDate.getDate() + 1);
        // let toDate : Date = this.requesterForm.controls['requesterToDate'].value;
        // toDate.setDate(toDate.getDate() + 1);
        // this.requesterService.pushRequest(
        //   null,
        //   this.requesterForm.controls['requesterName'].value,
        //   this.requesterForm.controls['contactEmail'].value,
        //   this.requesterForm.controls['contactPhone'].value,
        //   this.requesterForm.controls['requesterDescription'].value,
        //   this.requesterForm.controls['requesterDescriptionEn'].value,
        //   this.companiesAutoCtrl.value,
        //   fromDate,
        //   toDate,
        //   this.requesterForm.controls['requesterNumOfEntries'].value,
        //   this.pdf1src,
        //   this.pdf2src,
        //   this.personPay,
        //   this.vehiclePay
        // ).subscribe((data: Requester) => {
        //   this.requesterService.requests.push(data);
        //   this.router.navigate(['/approvals', 1], { queryParams: {'sb': 's'} });
        // });
      }
    }
  }

  intValidator(control: FormControl) {
    return isNaN(control.value) ? { "error": "NaN" } : null;
  }

  openPersonDialog() {
    let personDialogRef = this.dialog.open(DialogPersonComponent, {
      width: '45vw'
    });
  }

  editPerson(index: number){
    let p = this.requesterService.getPersonByIndex(index);
    let editPersonDialogRef = this.dialog.open(DialogPersonComponent, {
      width: '45wv',
      data: {person: p, index: index},
    });

  }

  deletePerson(index: number){
    this.requesterService.deletePerson(index);
  }

  editVehicle(index: number){
    let v = this.requesterService.getVehicleByIndex(index);
    let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: {vehicle: v, i: index, resource: false}
    });
  }

  deleteVehicle(index: number) {
    this.requesterService.deleteVehicle(index);
  }

  openVehicleDialog() {
    let vehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: {resource: false}
    });

    vehicleDialogRef.afterClosed().subscribe(a => {
    });
  }

  printRequest(): void {
    let pNumber = this.request.requestPersonJson.length;
    let vozilaHeader = this.request.requestVehicleJson.length > 0 ? 'Возила / Vehicles' : '';
    let vehiclesTable = '<table style="text-align:center; width: 80%; margin: auto; border: 1px solid black; border-collapse: collapse; margin-top: 5%; margin-bottom: 5%;">';
    let personsTable = '<table style="text-align:center; width: 80%; margin: auto; border: 1px solid black; border-collapse: collapse; margin-top: 5%; margin-bottom: 5%;">';
    // ${new AsptonormaldatePipe().transform(this.request.fromDate.toString()).replace(/-/g, '.')}-
    // ${new AsptonormaldatePipe().transform(this.request.toDate.toString()).replace(/-/g, '.')}
    let fromDate = this.datePipe.transform(this.request.fromDate, 'dd/MM/yyyy');
    let toDate = this.datePipe.transform(this.request.toDate, 'dd/MM/yyyy');
    for(let i = 0; i<this.request.requestVehicleJson.length; i++){
      vehiclesTable += '<tr><td style="width:5%;">' + (i+1).toString() + '</td><td style="border: 1px solid black; width: 50%;">' + this.request.requestVehicleJson[i].model + '</td>';
      vehiclesTable += '<td style="border: 1px solid black; width: 50%;">' + this.request.requestVehicleJson[i].plate + '</td></tr>';
    }
    let personsTD1 = '', personsTD2 = '';
    for(let i = 0; i<this.request.requestPersonJson.length; i++){
      personsTable += '<tr><td style="width:5%;">' + (i+1).toString() + '</td><td style="border: 1px solid black; width: 50%;">' + this.request.requestPersonJson[i].name + ' ' +
                      this.request.requestPersonJson[i].surname + '</td>';
      personsTable += '<td style="border: 1px solid black; width: 50%;">' + this.request.requestPersonJson[i].nameEn + ' ' +
                        this.request.requestPersonJson[i].surnameEn + '</td></tr>';
    }
    personsTable += '</table>';
    let printContents, popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html style="width:100%; height:100%;">
        <style>
          @media print {
            tr {
              page-break-inside: avoid;
            }
          }

          @media print {
            html, body {
              page-break-after: avoid;
              max-height: 99%;
            }

            div {
              max-height: 100%;
            }
          }
        </style>
        <body onload="window.print();window.close()" style="width:100%; height:100%;">

          <table style="margin:auto;">
            <tr style="padding-top: 20px; padding-bottom: 30px; display: block;">
              <td>
                <span style="display:block;">Министерство за внатрешни работи на Република Македонија</span>
                <span style="display:block;">Ministry of Internal Affairs of Republic of Macedonia</span>
                <span style="display:block;">Г-дин. Драги Илиевски/Mr. Dragi Ilievski</span>
                <span style="display:block;">Командир/Commander</span>
              </td>
              <td>
                <div style="margin-left:30%; display:block; border:2px solid black; height:2em; width:50%; padding-left:10%; padding-top:10%;">${this.request.id}</div>
                <span style="margin-left:30%; display:block; width: 100%;">Датум/Date: ${this.todayDate}</span>
              </td>
            </tr>
            <tr style="padding-bottom: 30px; display: block;">
              <td colspan="2">
                <span style="display:block;">Предмет: Дозвола за влез во воздушната страна на Меѓународен Аеродром Скопје</span>
                <span style="display:block;">Subject:  Permission to enter in the Airside zone of Skopje International Airport</span>
              </td>
            </tr>
            <tr style="padding-bottom: 30px; display: block;">
              <td colspan="2">
                <span style="display:block;">Почитуван Г-дин. Илиевски, </span>
                <span style="display:block;">Dear Mr. Ilievski</span>
              </td>
            </tr>
            <tr style="padding-bottom: 15px; display: block;">
              <td colspan="2">
                <p>
                  Ве молиме да одобрите дозвола за влез на долунаведените лица од  ${this.request.company.name}
                  кои ќе извршат ${this.request.description} од
                  ${fromDate}-
                  ${toDate}
                </p>
              </td>
            </tr>
            <tr style="padding-bottom: 15px; display: block;">
              <td>
                <p>
                  We kindly ask you to approve entrance permission for the following persons working at
                  ${this.request.company.nameEn} in order to perform ${this.request.descriptionEn}
                  starting from
                  ${fromDate}
                  to
                  ${toDate}
                </p>
              </td>
            </tr>
          </table>
          <h3>Персонал / Persons</h3>
          ${personsTable}

          <h3>${vozilaHeader}</h3>
          ${vehiclesTable}
          <div id="footer">
          <table style="width:90%;">
            <tr style="padding-bottom: 1em; display: block;">
              <td>
                <span style="display:block;">Со почит,</span>
                <span style="display:block;">Sincerely Yours,</span>
              </td>
            </tr>
            <tr style="padding-bottom: 30px; display: block;">
              <td style="width:50%; font-size: 0.9em;">
                <span style="display:block;">Александар Јаковлевски / Aleksandar Jakovlevski</span>
                <span style="display:block;">Менаџер на Оддел за Обезбедување</span>
                <span style="display:block;">Security Manager</span>
                <span style="display:block;">ТАВ Македонија Дооел/TAV Macedonia Dooel</span>
              </td>
              <td></td>
              <td style="width:50%; font-size: 0.9em;">
                <span style="display:block;">Јигит Лацин / Yigit Lacin</span>
                <span style="display:block;">Координатор на Аеродроми</span>
                <span style="display:block;">Airports Coordinator</span>
                <span style="display:block;">ТАВ Македонија Дооел/ TAV Macedonia Dooel</span>
              </td>
            </tr>
            <tr style="display:block;">
              <td colspan="2">
                <span style="display:block; font-size: 0.7em; color:#222;"><span style="text-decoration:underline;">Подготвил:</span></span>
                <span style="display:block; font-size: 0.7em; color:#222;">/м-р В.М/ M. Sc. V.M</span>
              </td>
            </tr>
          </table>
          </div>

        </body>
      </html>
      `
    );
    popupWin.document.close();
  };

  printRequest2(): void {
    let printContents, popupWin;
    let fromDate = this.datePipe.transform(this.request.fromDate, 'dd/MM/yyyy');
    let toDate = this.datePipe.transform(this.request.toDate, 'dd/MM/yyyy');
    let personTR = '', vehiclesTR = '', vehiclesTable ='';
    let reqCompany : Company;
    for(let i = 0; i<this.request.requestPersonJson.length; i++){
      personTR +=`<tr><td class="td-index">${i+1}</td><td>${this.request.requestPersonJson[i].name} ${this.request.requestPersonJson[i].surname}/${this.request.requestPersonJson[i].nameEn} ${this.request.requestPersonJson[i].surnameEn}</td></tr>`;
    }
    if(this.request.requestVehicleJson.length > 0){
      vehiclesTable += `
          <p class="table-desc">
             Се одобрува бесплатен влез на платформа за следните возила / Free of charge entrance at airside is allowed for the following vehicles:
          </p>
          <div class="vehicles-div">
             <table class="vehicles">
               <thead>
                 <th>No.</th>
                 <th>Registration number</th>
               </thead>
               <tbody>
          `;
        for(let i = 0; i<this.request.requestVehicleJson.length; i++){
          vehiclesTable += `<tr><td class="td-index">${i+1}</td><td>${this.request.requestVehicleJson[i].plate}</td></tr>`;
        }
        vehiclesTable += `
              </tbody>
              </table>
              </div>
            `;
    }
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html style="width:100%; height:100%;">
        <head>
          <style>
            div.grey-border {
              border: 3px solid grey;
            }

            div.logo {
              width: 30%;
              display: inline-block;
            }

            img.logo {
              width:100%;
              border: 3px solid grey;
            }

            div.wide {
              width: 100%;
            }

            div.header-div {
              width:100%;
              border: 3px solid grey;
              display: flex;
            }

            div.title {
              margin-left: 5%;
            }

            div.num-date {
              margin-left: 40%;
              display: flex;
              justify-content: space-around;
            }

            div.baranje-za {
              display: flex;
              justify-content: space-between;
              margin-top: 3%;
            }

            span.after-header {
              color:grey;
            }

            p.table-desc {
              margin-top: 3%;
            }

            div.persons-div {
              text-align:center;
            }

            table {
              margin:auto;
              margin-top: 3%;
              border-collapse: collapse;
            }

            table.persons {
              width:60%;
            }

            table.vehicles {
              width: 30%;
            }

            table th, td {
              border: 2px solid black;
              padding: 3px;
            }

            table td.td-index {
              text-align: center;
            }

            div.info-div {
              display: flex;
              justify-content: space-between;
              margin-top: 3%;
            }

            div.fgroup > span, div.group > div {
              display: block;
            }

            div.fgroup {
              width:40%;
            }

            div.fg2 {
              width: 20%;
            }

            div.fgroup > div {
              border: 1px solid black;
              width: 100%;
              padding: 3px;
            }

            div.req-desc {
              margin-top: 3%;
            }

            div.req-desc > * {
              display: block;
            }

            p.req-desc {
              font-weight: bold;
            }

            div.req-desc-actual {
              border: 1px solid black;
              padding: 3px;
              width: 100%;
            }

            div.footer {
              margin-top: 5%;
              font-weight: bold;
              font-size: 0.8em;
              display: flex;
              justify-content: space-around;
            }

            div.names-titles span {
              display: block;
            }

            @media print {
              tr {
                page-break-inside: avoid;
              }
            }

            @media print {
              html, body {
                page-break-after: avoid;
                max-height: 99%;
              }


            }
          </style>
        </head>
        <body onload="window.print();window.close()" style="width:90%; height:99%; padding-left: 5%; padding-right:5%">
          <div class="header-div">
            <div class="logo">
              <img
              src="data:image/jpeg;base64,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APhEaZ/8Zr2iij69if8An5L72H1aj/IvuRzHwo+Cfgz4DeHZtI8DeEfDHgzSbm5a8mstC0uDTreWdlVGlaOFVUuVRFLEZIRRnAFdPRRXPKcpPmk7s2SUVaOwUUUVIwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKbLKsMbO7BUUFmZjgADuadXyN/wAFwv2s/wDhkT/gnN441Ozuvs3iHxXEPC+jESeXIJ7sMkjoeoaO3E8gI7xjkZzXTg8LPE14YenvJpfeZV60aNOVWeyVz4x+I/8Awdp6Z4U+IevaXovwS/4SDR9N1G4tbDVB4z+z/wBpW6Sssdx5f2F9nmKA23c2N2Nxxmsb/iLy/wCre/8Ay+//AL3V+L9FfuceCMmSSdG//b0v/kj8xfEmYt3VT8I/5H7Qf8ReX/Vvf/l9/wD3uo/4i8v+re//AC+//vdX4v0VX+pOS/8APn/yaf8A8kL/AFkzH/n5+Ef8j+sT/gmz+3npH/BRv9lvTviPpeljQLmS8uNO1LSPtwvW0u5ib/VmUIm7dE0UgyinEo47n3yvwf8A+DVf9rUeBP2hPF/wg1K82WPjqyGr6RFI4Ci/tFPmogJ5aS3LMcZ4tR6V+8Ffj3EmVrL8wnh4L3d4+j/y2+R+g5PjXi8JGrLfZ+q/q4UUUV4R6YUUUUAFFFFAHyH/AMFbv+Cqn/DrTwT4N1j/AIQT/hOv+Etvriz8n+2/7M+yeVGj7t32ebfndjGBjHU1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UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z"

              class="logo grey-border">
            </div>
            <div class="title">
              <h3>Request for free of charge ID card / Vehicle entrance</h3>
              <div class="num-date">
                <span>Request NO: ${this.request.id} </span>
                <span> Date: ${this.todayDate}</span>
              </div>
            </div>
          </div>
          <span class="after-header">Unapproved requests will not be processed</span>
          <div class="baranje-za">
            <span style="font-weight: bold;">Барање за / Request for:</span>
            <span><input type="checkbox" name="idcard" value="idcard">ИД карта / ID Card</span>
            <span><input type="checkbox" name="vehicle-entrance" value="vehicle-entrance">Влез на возило на платформа / Vehicle Entrance at airside</span>
          </div>

          <p class="table-desc">
            Бесплатни ИД карти да бидат издадени за следните лица / Free of charge ID cards should be issued to the following personnel:
          </p>

          <div class="persons-div">
            <table class="persons">
              <thead>
                <th>No.</th>
                <th>Name and Surname</th>
              </thead>
              <tbody>
                ${personTR}
              </tbody>
            </table>
          </div>

          ${vehiclesTable}

          <div class="info-div">
            <div class="fgroup fg1">
              <span>Назив на компанијата / Company name</span>
              <div class="company-naziv">
                ${this.request.company.name} / ${this.request.company.nameEn}
              </div>
            </div>
            <div class="fgroup fg2">
              <span>Важност \ Validity Period</span>
              <div class="validity-period">
                ${fromDate} to ${toDate}
              </div>
            </div>
          </div>

          <div class="req-desc">
            <p class="req-desc">Краток опис на причината за барањето / Short description for the reason of the request</p>
            <div class="req-desc-actual">
              ${this.request.description}<br><br>
              ${this.request.descriptionEn}
            </div>
          </div>

          <div class="footer">
            <p>Approved by:</p>
            <div class="names-titles">
              <span>Mr. Aleksandar Jakovlevski</span>
              <span>Security Manager</span>
            </div>
            <div class="names-titles">
              <span>Mr. Yigit Lacin</span>
              <span>Airports  Coordinator</span>
            </div>
          </div>
        </body>
      </html>

      `
    );
    popupWin.document.close();
  };

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }


}
