import { Pipe, PipeTransform } from "@angular/core";


// @Pipe({name: 'asptonormaldate'})
// export class AsptonormaldatePipe implements PipeTransform {
//   transform(value: string, ...args: any[]) {
//     if(!value) return value;
//
//     return value.split('T');
//     // let parts = (value.split("T")[0]).split('-');
//     // return parts[2] + '-' + parts[1] + '-' + parts[0];
//   }

@Pipe({name: 'asptonormaldate'})
export class AsptonormaldatePipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    if(!value) return value;

    // return value;
    let parts = (value.split("T")[0]).split('-');
    // return value.slice(0, value.indexOf("T")-3);
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  }

}
