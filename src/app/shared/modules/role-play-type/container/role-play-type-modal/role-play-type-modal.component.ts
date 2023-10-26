import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-play-type-modal',
  templateUrl: './role-play-type-modal.component.html',
  styleUrls: ['./role-play-type-modal.component.scss']
})
export class RolePlayTypeModalComponent {
  
  constructor(public activeModal: NgbActiveModal) {}

  rolePlayType = 'JOB_INTERVIEW';

  onRolePlayTypeChanged(rolePlayType: any) {
    this.rolePlayType = rolePlayType;
  }

  onSave() {
    this.activeModal.close(this.rolePlayType);
  }
}
