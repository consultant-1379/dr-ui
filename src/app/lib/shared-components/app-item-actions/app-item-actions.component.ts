import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ActionItem } from '@erad/components';
import { IconButtonAction } from 'src/app/models';
import { RbacService } from 'src/app/services/rbac.service';

/**
 * Shared component used to display default buttons for pages,
 * e.g. used for the + icon on each page - i.e.
 * Install Feature Pack, Create Job, Create Schedule.
 *
 * Has support also for display a erad-action-list next to the buton(s)
 */
@Component({
  selector: 'dnr-app-item-actions',
  templateUrl: './app-item-actions.component.html',
  styleUrls: ['./app-item-actions.component.scss'],
})
export class AppItemActionsComponent implements OnInit {

  /**
   * Default button IconButtonAction array
   */
  @Input() iconButtonActions: IconButtonAction[] = [];
  /**
   * Whether the action is for admin only - default is false
   * (RBAC for feature packs is admin only)
   */
  @Input() isActionForAdminOnly: boolean = false;

  /**
   * TODO - below not used - see fpTableConfig,jobsTableConfig, schedulesTableConfig
   * they are for an extra erad-action-list as per html which may be something that
   * complies to some ERAD type wireframe */
  @Input() actionListLabel?: string;
  @Input() contextActions: ActionItem[] = [];
  @Output() contextActionClicked = new EventEmitter<ActionItem>();

  hasRbacWriteAccess: boolean = false;
  hasAdminAccess: boolean = false;

  constructor(readonly rbacService: RbacService) { }

  ngOnInit(): void {
    this.hasRbacWriteAccess = this.rbacService.isReadWrite();
    this.hasAdminAccess = this.rbacService.isAdmin();
  }

  userHasAccess(): boolean {
    return this.isActionForAdminOnly ? this.hasAdminAccess : this.hasRbacWriteAccess;
  }

  onActionsClicked(contextAction: ActionItem | any) {
    this.contextActionClicked.emit(contextAction);
  }
}
