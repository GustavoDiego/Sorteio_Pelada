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
import { RegisterDto } from '../../core/models/register.dto'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'app-register',
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
  templateUrl: './register.page.component.html',
  styleUrls: ['./register.page.component.scss']
})
export class RegisterPage {
  loading = false

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: MessageService
  ) {
    this.form = this.fb.nonNullable.group({
        username: [
          '',
          [Validators.required, Validators.pattern(/^\S+$/)]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
          ]
        ]
      })


  }

  register() {
    if (this.form.invalid) return

    this.loading = true

    this.authService.register(this.form.value as RegisterDto).subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Cadastro realizado',
          detail: 'Você já pode fazer login!',
          life: 2000
        })
        this.router.navigateByUrl('/login')
      },
      error: () => {
        this.message.add({
          severity: 'error',
          summary: 'Erro no cadastro',
          detail: 'Tente novamente com outro nome de usuário',
          life: 3000
        })
        this.loading = false
      },
      complete: () => {
        this.loading = false
      }
    })
  }

  goToLogin() {
    this.router.navigateByUrl('/login')
  }
}
