import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { DynamicDialogConfig, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Player } from '../../../core/models/player.model'
import { PlayersService } from '../../../core/services/players.service'
import { ConfirmacaoRemocaoModalComponent } from '../confirmacao-remocao-modal/confirmacao-remocao-modal.component'
import { DialogService } from 'primeng/dynamicdialog'

@Component({
  selector: 'app-editar-jogador-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    DynamicDialogModule
  ],
  templateUrl: './editar-jogador-modal.component.html',
  styleUrls: ['./editar-jogador-modal.component.scss']
})
export class EditarJogadorModalComponent {
  form !: FormGroup

  loading = false
  jogador: Player

  constructor(
    private fb: FormBuilder,
    private playersService: PlayersService,
    private toast: MessageService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dialog: DialogService
  ) {
    this.jogador = this.config.data.jogador
    console.log(this.jogador)
    this.form = this.fb.nonNullable.group({
      nome: [this.jogador.nome, Validators.required],
      forca: [this.jogador.forca, Validators.required],
      velocidade: [this.jogador.velocidade, Validators.required],
      passe: [this.jogador.passe, Validators.required],
      chute: [this.jogador.chute, Validators.required],
      corpo: [this.jogador.corpo, Validators.required],
      esperteza: [this.jogador.esperteza, Validators.required]
    })

  }
  campos = ['nome', 'forca', 'velocidade', 'passe', 'chute', 'corpo', 'esperteza']

  formatarLabel(campo: string): string {
    return campo.charAt(0).toUpperCase() + campo.slice(1)
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios' })
      return
    }

    this.loading = true
    this.playersService.update(this.jogador._id, this.form.value).subscribe({
      next: updated => {
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Jogador atualizado' })
        this.dialogRef.close(true)
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar' })
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

  confirmarRemocao() {
    const ref = this.dialog.open(ConfirmacaoRemocaoModalComponent, {
      header: '',
      width: '70vw',
      contentStyle: { padding: '0' },
      dismissableMask: true,
      closable: false,
      styleClass: 'no-dialog-wrapper',
      data: { id: this.jogador._id }
    })

    ref.onClose.subscribe(result => {
      if (result === 'removido') {
        this.dialogRef.close(true)
      }
    })
  }
}
