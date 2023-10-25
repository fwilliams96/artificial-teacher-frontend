import { Component, OnInit } from '@angular/core';
import { WallOfFameUser } from '../../interfaces/wall-of-fame-user';
import { UserService } from 'src/app/shared/modules/user/services/user/user.service';

@Component({
  selector: 'app-wall-of-fame',
  templateUrl: './wall-of-fame.component.html',
  styleUrls: ['./wall-of-fame.component.scss']
})
export class WallOfFameComponent implements OnInit {

  topUsers: WallOfFameUser[] = [];

  constructor(
    private readonly _userService: UserService  
  ) {}

  ngOnInit(): void {
    this._userService.getWallOfFame().subscribe(
      res => {
        this.topUsers = res;
      },
      error => {
        console.log(error);
      }
    )
  }

}
