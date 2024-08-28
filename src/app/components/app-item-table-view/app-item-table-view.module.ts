import { AppItemTableViewComponent } from './app-item-table-view.component';
import { AppItemTableViewService } from './services/app-item-table-view.service';
import { CommonModule } from '@angular/common';
import { DnrTableModule } from '../dnr-table/dnr-table.module';
import { InfoMessageComponentModule } from 'src/app/components/info-message/info-message.component.module';
import { NgModule } from '@angular/core';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [
    AppItemTableViewComponent
  ],
  imports: [
    CommonModule,
    DnrTableModule,
    InfoMessageComponentModule,
    SearchModule,
  ],
  exports: [
    AppItemTableViewComponent
  ],
  providers: [
    AppItemTableViewService
  ],
})
export class AppItemTableViewModule {}
