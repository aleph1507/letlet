import { NgModule } from '@angular/core';

import 'hammerjs';

import { MatButtonModule, MatFormFieldModule,
    MatSidenavModule, MatInputModule, MatToolbarModule,
    MatIconModule, MatCardModule, MatMenuModule,
    MatAutocompleteModule, MatDatepickerModule,
    MatNativeDateModule} from '@angular/material';

@NgModule({
  exports: [MatButtonModule, MatFormFieldModule,
            MatSidenavModule, MatInputModule,
            MatToolbarModule, MatIconModule,
            MatCardModule, MatMenuModule,
            MatAutocompleteModule, MatDatepickerModule,
            MatNativeDateModule]
})
export class MatModule { }
