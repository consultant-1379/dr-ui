import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { Application } from 'src/app/models/application.model';

/**
 * Class to display the applications card view wise
 * tab application is selected from left panel
 * @example
 *
 * <dnr-applications-card-view
 *    [applications]="applications"
 *    (applicationCardSelected)="applicationCardSelected" // emit when card is selected
 *  ></dnr-applications-card-view>
 */
@Component({
  selector: 'dnr-applications-card-view',
  templateUrl: './applications-card-view.component.html',
  styleUrls: ['./applications-card-view.component.scss'],
})
export class ApplicationsCardViewComponent implements OnInit {

  @Input() applications: Application[] = [];
  @Input() selectedApplicationId: string;
  @Output() applicationCardSelected = new EventEmitter<Application>();
  @Output() selectionCleared = new EventEmitter();

  statusBadgeColor: string;
  selected: boolean[];

  @Input()
  removePadding = false;

  ngOnInit(): void {
    if (this.selectedApplicationId) {
      setTimeout(() => this.scrollToSelectedCard());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedApplicationId = changes?.selectedApplicationId?.currentValue || this.selectedApplicationId;
    if (changes?.applications && changes?.applications?.currentValue !== changes?.applications?.previousValue) {
      this.applications = changes?.applications?.currentValue || [];
    }
    this._onApplicationSelection();
  }

  /* exposed for junit testing */
  _onApplicationSelection() {
    if (this.selectedApplicationId) {
      const appIndex = this._getApplicationIndex();
      this.onAppSelect(appIndex);
    }
  }

  onAppSelect(_appIndex: number) {
    this.selected = new Array(this.applications.length).fill(false);
    this.selected[_appIndex] = true;
    this.applicationCardSelected.emit(this.applications[_appIndex]);
  }

  scrollToSelectedCard() {
    document.getElementsByClassName('selectedItemCard')?.[0]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  onCardClicked(_appIndex): void {
    this.onAppSelect(_appIndex);
  }

  clearSelection() {
    this.selected = new Array(this.applications.length).fill(false);
    this.selectedApplicationId = null;
    this.selectionCleared.emit();
  }

  _getApplicationIndex() {
    return this.applications?.findIndex((app: Application) => {
      return app.id === this.selectedApplicationId
    });
  }
}
