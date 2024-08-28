import { ButtonModule, PaginationModule, SearchBarModule } from '@erad/components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    ButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    PaginationModule,
    SearchBarModule,
  ],
  exports: [
    ButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    PaginationModule,
    SearchBarModule,
  ]
})
export class SharedModule { }
