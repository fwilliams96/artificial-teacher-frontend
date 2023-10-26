import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FreeChatService } from 'src/app/pages/free-chat/services/free-chat.service';
import { ListeningService } from 'src/app/pages/listening/services/listening/listening.service';
import { PronunciationService } from 'src/app/pages/pronunciation/services/pronunciation.service';
import { RolePlayType } from 'src/app/pages/role-play/interfaces/role-play';
import { RolePlayService } from 'src/app/pages/role-play/services/role-play.service';
import { PreferencesModalComponent } from 'src/app/shared/modules/preferences/components/preferences-modal/preferences-modal.component';
import { Preference } from 'src/app/shared/modules/preferences/interfaces/preference';
import { UserPreference } from 'src/app/shared/modules/preferences/interfaces/user-preference';
import { PreferencesService } from 'src/app/shared/modules/preferences/services/preferences/preferences.service';
import { UserPreferencesService } from 'src/app/shared/modules/preferences/services/user-preferences/user-preferences.service';
import { RolePlayTypeModalComponent } from 'src/app/shared/modules/role-play-type/container/role-play-type-modal/role-play-type-modal.component';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
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
    private readonly _listeningService: ListeningService,
    private readonly _pronunciationService: PronunciationService,
    private readonly _rolePlayService: RolePlayService,
    private readonly _freeChatService: FreeChatService,
    private readonly _userPreferencesService: UserPreferencesService,
    private modalService: NgbModal,
    private readonly _infoToastService: InfoToastService,
    private router: Router,
    private readonly _dangerToastService: DangerToastService
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

  startListening() {
    this._listeningService.startListening().subscribe(
      listening => {
        this.router.navigate(['/listening', listening.id]);
      },
      err => {
        this._dangerToastService.show('Ha habido un error al crear el listening');
        console.log(err);
      }
    )

  }

  startPronunciation() {
    this._pronunciationService.createPronunciation().subscribe(
      pronunciation => {
        this.router.navigate(['/pronunciation', pronunciation.id]);
      },
      err => {
        this._dangerToastService.show('Ha habido un error al crear el ejercicio de pronunciación');
        console.log(err);
      }
    )
  }

  startRolePlay() {
    const modalRef = this.modalService.open(RolePlayTypeModalComponent, { backdrop: false, keyboard: false });

    modalRef.result.then(
      result => {
        console.log(result);
        this.createRolePlay(result);
      },
      reason => {
        console.log(reason);
      }
    )
    
  }

  createRolePlay(rolePlayTypeStr: string) {
    const rolePlayType = RolePlayType[rolePlayTypeStr as keyof typeof RolePlayType];

    this._rolePlayService.createRolePlay(rolePlayType).subscribe(
      rolePlay => {
        this.router.navigate(['/role-play', rolePlay.id]);
      },
      err => {
        this._dangerToastService.show('Ha habido un error al crear el role play');
        console.log(err);
      }
    )
  }

  startFreeChat() {
    this._freeChatService.startChat().subscribe(
      chat => {
        this.router.navigate(['/free-chat', chat.id]);
      },
      err => {
        this._dangerToastService.show('Ha habido un error al crear el chat libre');
        console.log(err);
      }
    )
  }

}
