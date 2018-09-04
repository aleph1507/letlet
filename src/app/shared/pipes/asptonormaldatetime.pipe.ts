import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'asptonormaldate'})
export class AsptonormaldatetimePipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    if(!value) return value;

    let parts = (value.split("T")[0]).split('-');
    let parts1 = (value.split("T")[1]);//.slice(0, (value.split("T")[1]).indexOf('.'));a
    return parts[2] + '-' + parts[1] + '-' + parts[0] + ' ' + parts1[0];
  }

}
