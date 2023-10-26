import { Pipe, PipeTransform } from '@angular/core';
import { RolePlayType } from '../interfaces/role-play';

@Pipe({
  name: 'rolePlayType'
})
export class RolePlayTypePipe implements PipeTransform {

  transform(value: RolePlayType): string {
    let rolePlayTypeStr = value.toString().replace("_", " ").toLowerCase();
    return rolePlayTypeStr.charAt(0).toUpperCase() + rolePlayTypeStr.substring(1);
  }

}
