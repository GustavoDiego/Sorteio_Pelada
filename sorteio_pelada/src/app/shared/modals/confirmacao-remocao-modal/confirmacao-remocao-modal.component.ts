import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { PlayersService } from '../../../core/services/players.service'

@Component({
  standalone: true,
  selector: 'app-confirmacao-remocao-modal',
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="confirm-modal">
      <i class="pi pi-exclamation-triangle danger-icon"></i>
      <p>Tem certeza que deseja remover este jogador?</p>
      <div class="confirm-actions">
        <button pButton label="Cancelar" (click)="ref.close()" class="p-button-text"></button>
        <button pButton label="Remover" icon="pi pi-trash" (click)="remover()" class="p-button-danger"></button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-modal {
      text-align: center;
      padding: 1.5rem;
      background-color: #121212;
      color: white;
      border-radius: 12px;
      max-width: 80vw;
      margin: 0 auto;
    }

    .danger-icon {
      font-size: 2rem;
      color: #e74c3c;
      margin-bottom: 0.5rem;
    }

    .confirm-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class ConfirmacaoRemocaoModalComponent {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private playersService: PlayersService
  ) {}

  remover() {
    const id = this.config.data.id
    this.playersService.delete(id).subscribe(() => {
      this.ref.close('removido')
    })
  }
}

