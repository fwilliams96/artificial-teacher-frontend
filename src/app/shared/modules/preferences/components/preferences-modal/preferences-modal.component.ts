import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Preference } from '../../interfaces/preference';

@Component({
  selector: 'app-preferences-modal',
  templateUrl: './preferences-modal.component.html',
  styleUrls: ['./preferences-modal.component.scss']
})
export class PreferencesModalComponent {
  @Input() name = '';

  @Input() preferences: Preference[] = []

	constructor(public activeModal: NgbActiveModal) {}

  toggleReference(preference: Preference) {
    preference.checked = !preference.checked;
  }

  noPreferenceChecked() {
    for(let preference of this.preferences) {
      if (preference.checked) return false;
    }
    return true;
  }

}
