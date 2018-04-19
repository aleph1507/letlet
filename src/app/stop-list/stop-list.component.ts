import { Component, OnInit } from '@angular/core';
import { StopListService } from '../services/stop-list.service';
import { StopListEntry } from '../models/StopListEntry.model';
import { MatTableDataSource } from '@angular/material';

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

  slDataSource;

  constructor(private slService: StopListService) { }

  ngOnInit() {
    this.slEntries = this.slService.getStopListEntries();
    this.slDataSource = new MatTableDataSource(this.slEntries);
    console.log(this.slService.getStopListEntries());
    // console.log(this.dataSource);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.slDataSource.filter = filterValue;
  }

}
