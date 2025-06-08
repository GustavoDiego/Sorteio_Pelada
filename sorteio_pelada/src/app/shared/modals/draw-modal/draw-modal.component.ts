import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { Player } from '../../../core/models/player.model'
import { DrawService } from '../../../core/services/draw.service'

@Component({
  selector: 'app-draw-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './draw-modal.component.html',
  styleUrls: ['./draw-modal.component.scss']
})
export class DrawModalComponent {
  jogadores: Player[] = []
  jogadoresPorTime = 5
  numeroDeTimes = 0
  maxJogadores = 0
  loading = false

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private drawService: DrawService,
    private toast: MessageService
  ) {
    this.jogadores = this.config.data.jogadores
    this.maxJogadores = this.jogadores.length
    this.recalcularTimes()
  }

  recalcularTimes() {
    if (!this.jogadoresPorTime || this.jogadoresPorTime < 1) {
      this.numeroDeTimes = 0
      return
    }

    this.numeroDeTimes = Math.ceil(this.jogadores.length / this.jogadoresPorTime)
  }


  sortear() {
    if (this.jogadoresPorTime < 1 || this.jogadoresPorTime > this.maxJogadores) {
      this.toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Quantidade inválida' })
      return
    }

    this.recalcularTimes()
    this.loading = true

    this.drawService.sortear(this.jogadores, this.numeroDeTimes, this.jogadoresPorTime).subscribe({
      next: times => {
        this.dialogRef.close(times)
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao sortear' })
        this.loading = false
      }
    })
  }
}
