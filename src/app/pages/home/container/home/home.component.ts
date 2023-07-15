import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreferencesModalComponent } from 'src/app/shared/modules/preferences/components/preferences-modal/preferences-modal.component';
import { Preference } from 'src/app/shared/modules/preferences/interfaces/preference';
import { UserPreference } from 'src/app/shared/modules/preferences/interfaces/user-preference';
import { PreferencesService } from 'src/app/shared/modules/preferences/services/preferences/preferences.service';
import { UserPreferencesService } from 'src/app/shared/modules/preferences/services/user-preferences/user-preferences.service';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  preferences: Preference[] = [];

  constructor(
    private readonly _preferencesService: PreferencesService,
    private readonly _userPreferencesService: UserPreferencesService,
    private modalService: NgbModal,
    private readonly _infoToastService: InfoToastService,
  ) {}

  ngOnInit(): void {
    this._userPreferencesService.getUserPreferences().subscribe(
      res => {
        if (res.length === 0) {
          this._preferencesService.getPreferences().subscribe(
            res => {
              this.preferences = res;
              const modalRef = this.modalService.open(PreferencesModalComponent, { backdrop: false, keyboard: false });
              modalRef.componentInstance.name = 'World';
              modalRef.componentInstance.preferences = this.preferences;

              modalRef.result.then(
                result => {
                  const checkedPreferences = this.preferences
                  .filter(preference => preference.checked);
                  if (checkedPreferences.length > 0) {
                    const userPreferences = checkedPreferences.map(checkedPreference => {
                      return {
                        preference_id: checkedPreference.id
                      }
                    }) as UserPreference[];
                    console.log(userPreferences)
                    this._userPreferencesService.addUserPreferences(userPreferences).subscribe(
                      res => {
                        this._infoToastService.show("Tus preferencias se han guardado correctamente");
                      },
                      err => {
                        console.log(err);
                      }
                    );
                  }
                },
                reason => {
                  console.log(reason);
                }
              )

            },
            err => {
              console.log(err);
            }
          )
        }
      },
      err => {
        console.log(err);
      }
    )
  }

}
