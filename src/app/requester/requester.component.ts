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
  showDeleteBtn : boolean = false;

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
              this.request.approved ? this.showDeleteBtn = false : this.showDeleteBtn = true;
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

  delete(id: number) {
    this.requesterService.deleteRequest(id).subscribe(
      (data: boolean) => {
        data ? this.router.navigate(['/approvals', 2], { queryParams: {'sb': 's'} }) : this.router.navigate(['/approvals', 2], { queryParams: {'sb': 's'} });
      }
    )
  }

  imagesCheck() {
    // return !this.requesterService.isEmptyPersons();
    if(this.requesterService.isEmptyPersons())
      return false;

    let pdf1 = <HTMLInputElement>document.getElementById('pdf1');
    if(pdf1.files[0] == null || pdf1.files[0] == undefined)
      return false;

    return true;
    // if(!this.pdf1src){
    //   return this.checkPersons() || this.checkVehicles() ? true : false;
    // } else if(this.pdf1src.size < 1 || this.pdf1src == null || this.pdf1src == undefined) {
    //   return this.checkPersons() || this.checkVehicles() ? true : false;
    // } else {
    //   return this.requesterService.isEmptyPersons();
    // }
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

      console.log('this.requesterForm: ', this.requesterForm);

      // let fromDate = new Date(this.requesterForm.controls['requesterFromDate'].value);
      // let toDate = new Date(this.requesterForm.controls['requesterToDate'].value);
      // fromDate.setDate(fromDate.getDate() + 1);
      // toDate.setDate(toDate.getDate() + 1);
      // let pdf1 = <HTMLInputElement>document.getElementById('pdf1');
      // let pdf2 = <HTMLInputElement>document.getElementById('pdf2');
      //
      // let formData = new FormData();
      // formData.append('requesterName', this.requesterForm.controls['requesterName'].value);
      // formData.append('contactEmail', this.requesterForm.controls['requesterName'].value);
      // formData.append('contactPhone', this.requesterForm.controls['contactPhone'].value);
      // formData.append('requesterDescription', this.requesterForm.controls['requesterDescription'].value);
      // formData.append('requesterDescriptionEn', this.requesterForm.controls['requesterDescriptionEn'].value);
      // formData.append('companyId', this.companiesAutoCtrl.value.id);
      // formData.append('fromDate', fromDate.toString());
      // formData.append('toDate', toDate.toString());
      // if(pdf1 != null)
      //   formData.append('pdf1', pdf1.files[0], 'pdf1.pdf');
      // if(pdf2 != null)
      //   formData.append('pdf2', pdf2.files[0], 'pdf2.pdf');
      // formData.append('personPay', this.personPay.toString());
      // formData.append('vehiclePay', this.vehiclePay.toString());
      let id = this.request.id;

        let fd : string = this.requesterForm.controls['requesterFromDate'].value;
        let fromDate = new Date(fd);
        console.log('fromDate pred setDate: ', fromDate);
        fromDate.setHours(12,0,0);
        //fromDate.setDate(fromDate.getDate()+1);
        console.log('fromDate posle setDate: ', fromDate);
        let td : string = this.requesterForm.controls['requesterToDate'].value;
        let toDate = new Date(td);
        console.log('toDate pred setDate: ', toDate);
        toDate.setHours(12,0,0);
        //toDate.setDate(toDate.getDate()+1);
        console.log('toDate posle setDate: ', toDate);
        this.request.requesterName = this.requesterForm.controls['requesterName'].value;
        this.request.contactEmail = this.requesterForm.controls['contactEmail'].value;
        this.request.contactPhone = this.requesterForm.controls['contactPhone'].value;
        this.request.description = this.requesterForm.controls['requesterDescription'].value;
        this.request.descriptionEn = this.requesterForm.controls['requesterDescriptionEn'].value;
        this.request.companyId = this.companiesAutoCtrl.value.id;
        this.request.fromDate = fromDate;
        this.request.toDate = toDate;
        this.request.numberOfEntries = this.requesterForm.controls['requesterNumOfEntries'].value;
        this.request.personPay = this.personPay;
        this.request.vehiclePay = this.vehiclePay;
        if(this.pdf1src != null)
          this.request.pdf1 = this.pdf1src;
        if(this.pdf2src != null)
          this.request.pdf2 = null;
        let o_request = this.request;
        // console.log('pred service editRequest.subscribe');
        this.requesterService.editRequest(this.request, id).subscribe((data: Requester) => {
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
        'vehiclePay' : this.vehiclePay.toString(),
        'persons' : JSON.stringify(this.requesterService.persons),
        'vehicles' : JSON.stringify(this.requesterService.vehicles),
        'requesterNumOfEntries' : this.requesterForm.controls['requesterNumOfEntries'].value
      }
      formData.append('reqForm', JSON.stringify(reqForm));
      formData.append('pdf1', pdf1.files[0], 'pdf1.pdf');
      formData.append('pdf2', pdf2.files[0], 'pdf2.pdf');
      // let persons = JSON.stringify(this.requesterService.persons);
      // let vehicles = JSON.stringify(this.requesterService.vehicles);
      // formData.append('reqForm', JSON.stringify(reqForm));
      // formData.append('persons', persons);
      // formData.append('vehicles', vehicles);

      if(this.editMode){
        this.resources.companies.getCompanyById(this.request.companyId)
          .subscribe((data : Company) => {
            this.reqCompany = data;
          });
        let id = this.request.id;
        this.requesterService.editRequest(this.request, id);
        this.router.navigate(['/approvals', 1]);
      } else {
        this.requesterService.pushRequest(null, formData)
        .subscribe((data: Requester) => {
          this.requesterService.requests.push(data);
          this.router.navigate(['/approvals', 1], { queryParams: {'sb': 's'} });
        });
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
              max-width:100%;
              border: 3px solid grey;
              padding: 0;
              padding-left: 4%;
              padding-right: 4%;
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
              src="data:image/png;base64,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"

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
