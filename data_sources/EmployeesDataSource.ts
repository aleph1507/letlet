import { DataSource } from "@angular/cdk/collections";
import { Employee } from "../../../models/Employee";
import { CollectionViewer } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs";
import { ResourcesService } from "../../../services/resources.service";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export class EmployeesDataSource implements DataSource<Employee> {

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private resourcesService: ResourcesService){}

  connect(collectionViewer: CollectionViewer): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.employeesSubject.complete();
    this.loadingSubject.complete();
  }

  loadEmployees(pageIndex: number, pageSize: number){
    this.loadingSubject.next(true);

    this.resourcesService.employees.getEmployeesPage(pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(employees => this.employeesSubject.next(employees))
  }

}
