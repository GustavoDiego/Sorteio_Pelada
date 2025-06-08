import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AuthService } from '../../../core/services/auth.service'
import { UsernameFormatPipe } from '../../../core/pipes/username-format.pipe'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, UsernameFormatPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private auth: AuthService
  ) {}
    ngOnInit() {
    this.auth.getProfile().subscribe(user => {
      console.log('Perfil carregado:', user)
    })
  }
  logout() {
    this.auth.logout()
    this.router.navigateByUrl('/login')
  }

  goHome() {
    this.router.navigateByUrl('/home')
  }

  get username() {

    return this.auth.getUser()?.username || ''
  }
}
