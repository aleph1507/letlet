import { Component, OnInit, ViewChild } from '@angular/core';
import { StopListService } from '../services/stop-list.service';
import { StopListEntry } from '../models/StopListEntry.model';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.css']
})
export class StopListComponent implements OnInit {

  slEntries: StopListEntry[];
  displayedColumns = [
    'name', 'surname', 'jobTitle', 'ID', 'validityDate', 'backgroundValidityCheck',
    'approvedAreas', 'dateOfIssue', 'status', 'secAwareDOT', 'proximityCardNo',
    'code', 'airport'
  ];

  @ViewChild(MatSort) sort: MatSort;

  slDataSource;

  constructor(private slService: StopListService) { }

  ngOnInit() {
    this.slEntries = this.slService.getStopListEntries();
    this.slDataSource = new MatTableDataSource(this.slEntries);
    this.slDataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.slDataSource.filter = filterValue;
  }

}
