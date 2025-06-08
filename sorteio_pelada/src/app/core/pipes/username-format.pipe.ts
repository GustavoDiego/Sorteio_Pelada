import { Pipe, PipeTransform } from '@angular/core'


@Pipe({
  name: 'usernameFormat',
  standalone: true,
  pure: true,
})
export class UsernameFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''
    return value.replace(/_/g, ' ').toUpperCase()
  }
}
