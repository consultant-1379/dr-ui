import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SearchFilterTabsComponent } from './components/search-filter-tabs/search-filter-tabs.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { ActionListModule, EdsIconModule, SearchBarModule, TabsModule } from '@erad/components';
import { TranslateModule } from '@ngx-translate/core';
import { CollapsibleItemModule } from '@erad/components/collapsible-item';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SearchComponent,
    SearchFilterTabsComponent,
    SearchFilterComponent,
  ],
  exports: [
    SearchComponent
  ],
  imports: [
    ActionListModule,
    CollapsibleItemModule,
    CommonModule,
    EdsIconModule,
    MatTooltipModule,
    MatRippleModule, // for mat-ripple mat-tab-header-pagination arrows
    SearchBarModule,
    TabsModule,
    TranslateModule.forChild(),
  ]
})
export class SearchModule { }
