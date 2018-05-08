import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { Requester } from '../models/Requester.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { DialogPersonComponent } from './dialog-person/dialog-person.component';
import { DialogVehicleComponent } from './dialog-vehicle/dialog-vehicle.component';
import { MatDialog } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import "rxjs/add/observable/of";
import { RequesterService } from '../services/requester.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResourcesService } from '../services/resources.service';

@Component({
  selector: 'app-requester',
  templateUrl: './requester.component.html',
  styleUrls: ['./requester.component.css']
})
export class RequesterComponent implements OnInit, OnDestroy {

  hoveredEditPerson = false;

  nEntries = [];

  // companies = this.resources.getCompanies();
  companies = this.resources.companies.getCompaniesNames();

  displayedPersonColumns = ['name', 'surname'];
  displayedVehicleColumns = ['model', 'plate'];

  filteredCompanies: Observable<string[]>;

  requesterForm: FormGroup;
  request = new Requester();

  validForm = true;
  editMode: boolean = false;

  paramsSub: any;
  id: number = null;

  constructor(private dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              public requesterService: RequesterService,
              private route: ActivatedRoute,
              private resources: ResourcesService
            ) { }

  ngOnInit() {
    for(let i = 1; i<= 15; i++)
      this.nEntries.push({name: i.toString(), value: i});

    this.nEntries.push({name: 'Unlimited', value: -1});

    this.paramsSub = this.route.params.subscribe(params => {
      if(params['id'] && this.requesterService.getRequest(+params['id']) !== undefined){
        this.id = +params['id'];
        this.editMode = true;
        this.request = this.requesterService.getRequest(this.id);
        this.requesterService.setPersons(this.request.persons);
        // this.requesterService.setVehicles(this.request.vehicles);
        this.requesterService.setVehicles(this.request.vehicles);
      }
    });

    console.log('this.request: ', this.request);

    this.requesterForm = new FormGroup({
      'requesterName': new FormControl(this.request.requesterName, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterDescription': new FormControl(this.request.description, {
        updateOn: 'change'
      }),
      'requesterCompany': new FormControl(this.request.company, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterFromDate': new FormControl(this.request.from, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterToDate': new FormControl(this.request.to, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterNumOfEntries': new FormControl(this.request.numEntries, {
        validators: [Validators.required]
      })
    })

      this.filteredCompanies = this.requesterForm.controls['requesterCompany'].valueChanges
        .pipe(
          startWith(''),
          map(company => this.filterCompanies(company))
        );
    // this.requesterForm.controls['requesterCompany']
  }

  onSubmit() {
    if(this.requesterForm.valid) {
      if(this.editMode){
        this.request.requesterName = this.requesterForm.controls['requesterName'].value;
        this.request.description = this.requesterForm.controls['requesterDescription'].value;
        this.request.company = this.requesterForm.controls['requesterCompany'].value;
        this.request.from = this.requesterForm.controls['requesterFromDate'].value;
        this.request.to = this.requesterForm.controls['requesterToDate'].value;
        this.request.numEntries = this.requesterForm.controls['requesterNumOfEntries'].value;
        this.requesterService.editRequest(this.request);
      } else {
        this.requesterService.pushRequest(
          this.requesterForm.controls['requesterName'].value,
          this.requesterForm.controls['requesterDescription'].value,
          this.requesterForm.controls['requesterCompany'].value,
          this.requesterForm.controls['requesterFromDate'].value,
          this.requesterForm.controls['requesterToDate'].value,
          this.requesterForm.controls['requesterNumOfEntries'].value
        );
      }
    }
    // this.requesterForm.reset();
    this.requesterForm.controls['requesterName'].setValue('');
    this.requesterForm.controls['requesterName'].markAsPristine();
    this.requesterForm.controls['requesterName'].markAsUntouched();
    this.requesterForm.controls['requesterDescription'].setValue('');
    this.requesterForm.controls['requesterDescription'].markAsPristine();
    this.requesterForm.controls['requesterDescription'].markAsUntouched();
    this.requesterForm.controls['requesterCompany'].setValue('');
    this.requesterForm.controls['requesterCompany'].markAsPristine();
    this.requesterForm.controls['requesterCompany'].markAsUntouched();
    this.requesterForm.controls['requesterFromDate'].setValue('');
    this.requesterForm.controls['requesterFromDate'].markAsPristine();
    this.requesterForm.controls['requesterFromDate'].markAsUntouched();
    this.requesterForm.controls['requesterToDate'].setValue('');
    this.requesterForm.controls['requesterToDate'].markAsPristine();
    this.requesterForm.controls['requesterToDate'].markAsUntouched();
    this.requesterForm.controls['requesterNumOfEntries'].setValue('');
    this.requesterForm.controls['requesterNumOfEntries'].markAsPristine();
    this.requesterForm.controls['requesterNumOfEntries'].markAsUntouched();
  }

  filterCompanies(name: string) {
    return this.companies.filter(company =>
      company.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
    // let v = this.resources.vehicles.getVehicleByIndex(index);
    let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: {vehicle: v, i: index, resource: false}
    });

    console.log('posle edit vehicles: ', this.requesterService.getAllVehicles());
  }

  deleteVehicle(index: number) {
    this.requesterService.deleteVehicle(index);
    // this.resources.vehicles.deleteVehicle(index);
  }

  openVehicleDialog() {
    let vehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: {resource: false}
    });

    vehicleDialogRef.afterClosed().subscribe(a => {
      console.log('posle add vehicles: ', this.requesterService.getAllVehicles());
    });
  }

  printRequest(): void {
    console.log("printRequest");
    let pNumber = this.request.persons.length;
    console.log("pNumber : " + pNumber);
    let personsTD1 = '', personsTD2 = '';
  //   <span style="display: block;">1. Сотир Геракар/Sotir Gerakar</span>
  //   <span style="display:block;">2. Ѓорѓи Додевски / Gjorgji Dodevski</span>
  //   <span style="display:block;">3. Игор Ангеловски/Igor Angelovski</span>
  // </td>
  // <td>
  //   <span style="display:block;">4. Александар Ангеловски / Aleksandar Angelovski</span>
  //   <span style="display:block;">5. Ванчо Тенев / Vancho Tenev</span>
  //   <span style="display:block;">6. Дејан Гелевски/Dejan Gelevski</span>
    for(let i = 0; i<this.request.persons.length; i++){
      console.log("this.request.person[i].surname : " + this.request.persons[i].surname);
      if(i % 2 == 1){
        personsTD2 += '<span style="display: block;">' + this.request.persons[i].name + ' ' +
           this.request.persons[i].surname + '/' + this.request.persons[i].nameCyrilic + ' ' + this.request.persons[i].surnameCyrilic + '</span>';
        continue;
      }
      personsTD1 += '<span style="display: block;">' + this.request.persons[i].name + ' ' +
        this.request.persons[i].surname + '/' + this.request.persons[i].nameCyrilic + ' ' + this.request.persons[i].surnameCyrilic + '</span>';
    }

    console.log("personsTD1 : " + personsTD1);
    console.log("personsTD2 : " + personsTD2);
    let printContents, popupWin;
    // printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html style="width:100%; height:100%;">
        <body onload="window.print();window.close()" style="width:100%; height:100%;">
          <table style="width:80%; padding-left:30px; padding-right:30px;">
            <tr style="padding-top: 30px; padding-bottom: 30px; display: block;">
              <td>
                <span style="display:block;">Министерство за внатрешни работи на Република Македонија</span>
                <span style="display:block;">Ministry of Internal Affairs of Republic of Macedonia</span>
                <span style="display:block;">Г-дин. Драги Илиевски/Mr. Dragi Ilievski</span>
                <span style="display:block;">Командир/Commander</span>
              </td>
              <td>
                <div style="margin-left:30%; display:block; border:2px solid black; height:2em; width:50%;"></div>
                <span style="margin-left:30%; display:block; width: 100%;">Датум/Date: 30 / 04 / 2018</span>
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
                <span style="display:block;">Dear Mr. Илиевски</span>
              </td>
            </tr>
            <tr style="padding-bottom: 15px; display: block;">
              <td colspan="2">
                <p>
                  Ве молиме да одобрите дозвола за влез за
                  долунаведенитe лицa од ${this.request.company} кои ќе
                  извршат поставување на нов рекламен банер
                   за ТАВ Македонија Оперативни Услуги од
                    02.05.2018 до 04.05.2018
                </p>
              </td>
            </tr>
            <tr style="padding-bottom: 15px; display: block;">
              <td>
                <p>
                  We kindly ask you to approve entrance permission for
                   the below mentioned person from  ${this.request.company}  who will perform
                    installation of advertising banner in TAV
                     МОS  from 02.05.2018 to 04.05.2018
                </p>
              </td>
            </tr>
            <tr style="padding-bottom: 30px; padding-left: 15%; padding-right: 15%; display: block;">
              <td>
                ${personsTD1}
              </td>
              <td>
                ${personsTD2}
              </td>
            </tr>
            <tr style="padding-bottom: 1em; display: block;">
              <td>
                <span style="display:block;">Со почит,</span>
                <span style="display:block;">Sincerely Yours,</span>
              </td>
            </tr>
            <tr style="padding-bottom: 30px; display: block;">
              <td>
                <span style="display:block;">Александар Јаковлевски/ Aleksandar Jakovlevski</span>
                <span style="display:block;">Менаџер на Оддел за Обезбедување</span>
                <span style="display:block;">Security Manager</span>
                <span style="display:block;">ТАВ Македонија Дооел/TAV Macedonia Dooel</span>
              </td>
              <td>
                <span style="display:block;">Јигит Лацин / Yigit Lacin</span>
                <span style="display:block;">Координатор на Аеродроми</span>
                <span style="display:block;">Airports Coordinator</span>
                <span style="display:block;">ТАВ Македонија Дооел/ TAV Macedonia Dooel</span>
              </td>
            </tr>
            <tr style="display:block;">
              <td colspan="2">
                <span style="display:block; font-size: 0.7em; color:#222;"><span style="text-decoration:underline;">Прилог:</span> 6 Копии од лична карта</span>
                <span style="display:block; font-size: 0.7em; color:#222;"><span style="text-decoration:underline;">Attachment:</span> 6 ID  Copy</span>
                <span style="display:block; font-size: 0.7em; color:#222;">/м-р В.М/ M. Sc. V.M</span>
              </td>
            </tr>
          </table>
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
