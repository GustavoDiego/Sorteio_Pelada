import { Component } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { Toast, ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { AuthService } from '../../core/services/auth.service'
import { LoginDto } from '../../core/models/login.dto'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './login.page.component.html',
  styleUrls: ['./login.page.component.scss']
})
export class LoginPage {
  loading = false
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: MessageService
  ) {
    this.form = this.fb.group({
      username: this.fb.nonNullable.control('', Validators.required),
      password: this.fb.nonNullable.control('', Validators.required)
    })

  }
  navigateToRegister() {
     this.router.navigateByUrl('/register')
  }


  login() {
    if (this.form.invalid) return

    this.loading = true

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Login realizado',
          detail: 'Bem-vindo!',
          life: 2000
        })

        setTimeout(() => {
          this.router.navigateByUrl('/home')
        }, 2000)
      },

      error: () => {
        this.message.add({
          severity: 'error',
          summary: 'Falha no login',
          detail: 'Usuário ou senha inválidos',
          life: 3000
        })
        this.loading = false
      },
      complete: () => {
        this.loading = false
      }
    })
  }
}
