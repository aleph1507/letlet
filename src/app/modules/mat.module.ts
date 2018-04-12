import { NgModule } from '@angular/core';

import 'hammerjs';

import { MatButtonModule, MatFormFieldModule,
    MatSidenavModule, MatInputModule, MatToolbarModule,
    MatIconModule, MatCardModule  } from '@angular/material';

@NgModule({
  exports: [MatButtonModule, MatFormFieldModule,
            MatSidenavModule, MatInputModule,
            MatToolbarModule, MatIconModule,
            MatCardModule]
})
export class MatModule { }
