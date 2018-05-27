import { NgModule } from '@angular/core';

import 'hammerjs';

import { MatButtonModule, MatFormFieldModule,
    MatSidenavModule, MatInputModule, MatToolbarModule,
    MatIconModule, MatCardModule, MatMenuModule,
    MatAutocompleteModule, MatDatepickerModule,
    MatNativeDateModule, MatDialogModule,
    MatDividerModule, MatTableModule, MatListModule,
    MatRadioModule, MatSortModule, MatPaginatorModule,
    MatSelectModule, MatCheckboxModule } from '@angular/material';
@NgModule({
  exports: [MatButtonModule, MatFormFieldModule,
            MatSidenavModule, MatInputModule,
            MatToolbarModule, MatIconModule,
            MatCardModule, MatMenuModule,
            MatAutocompleteModule, MatDatepickerModule,
            MatNativeDateModule, MatDialogModule,
            MatDividerModule, MatTableModule, MatListModule,
            MatRadioModule, MatSortModule, MatPaginatorModule,
            MatSelectModule, MatCheckboxModule]
})
export class MatModule { }
