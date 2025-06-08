import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { DialogService, DynamicDialogModule, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { PasswordModule } from 'primeng/password'
import { PlayersService } from '../../../core/services/players.service'

@Component({
  selector: 'app-registro-jogador-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './registro-jogador-modal.component.html',
  styleUrls: ['./registro-jogador-modal.component.scss']
})
export class RegistroJogadorModalComponent {
  form: FormGroup
  loading = false

  constructor(
    private fb: FormBuilder,
    private playersService: PlayersService,
    private toast: MessageService,
    private dialogRef: DynamicDialogRef
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      forca: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      velocidade: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      passe: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      chute: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      corpo: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      esperteza: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
    })

  }
  close() {
    this.dialogRef.close()
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios' })
      return
    }


    this.loading = true
    this.playersService.create(this.form.value).subscribe({
      next: player => {
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Jogador criado com sucesso' })
        this.dialogRef.close(player)
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar jogador' })
        this.loading = false
      }
    })
  }
  getErrorMessage(campo: string): string {
    const control = this.form.get(campo)
    if (control?.hasError('required')) return 'Campo obrigatório'
    if (control?.hasError('min')) return 'Valor mínimo é 0'
    if (control?.hasError('max')) return 'Valor máximo é 5'
    return ''
  }
}
