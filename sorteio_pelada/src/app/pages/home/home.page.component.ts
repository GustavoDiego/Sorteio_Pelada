import { Component, OnInit } from '@angular/core'
import { PlayersService } from '../../core/services/players.service'
import { Player } from '../../core/models/player.model'
import { ConfirmationService, MessageService } from 'primeng/api'
import { NavbarComponent } from '../../shared/components/navbar/navbar.component'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { FormsModule } from '@angular/forms'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { RegistroJogadorModalComponent } from '../../shared/modals/registro-jogador-modal/registro-jogador-modal.component'
import { EditarJogadorModalComponent } from '../../shared/modals/editar-jogador-modal/editar-jogador-modal.component'
import { DrawModalComponent } from '../../shared/modals/draw-modal/draw-modal.component'

@Component({
  standalone: true,
  imports : [ NavbarComponent,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    CheckboxModule,
    DynamicDialogModule
  ],
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class HomePage implements OnInit {
  players: Player[] = []
  selectedPlayers: Player[] = []
  loading = false
  searchValue = ''

  constructor(
    private playerService: PlayersService,
    private confirmation: ConfirmationService,
    private message: MessageService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.loadPlayers()
  }
  onSearchInput(event: Event, dt: any) {
      const input = event.target as HTMLInputElement
      const value = input?.value ?? ''
      dt.filterGlobal(value, 'contains')
    }

  clearFilters(table: any) {
  this.searchValue = ''
  table.clear()
}

  loadPlayers() {
    this.loading = true
    this.playerService.getAll().subscribe({
      next: data => (this.players = data),
      error: () =>
        this.message.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar jogadores'
        }),
      complete: () => (this.loading = false)
    })
  }

  openCreateModal() {
    const ref = this.dialog.open(RegistroJogadorModalComponent, {
        header: '',
        width: '70vw',
        contentStyle: { padding: '0' }, // remove padding extra
        dismissableMask: true,
        closable: false,
        styleClass: 'no-dialog-wrapper'
      })

    ref.onClose.subscribe(result => {
      if (result) {
        this.message.add({
          severity: 'success',
          summary: 'Jogador criado',
          detail: `Jogador ${result.nome} foi adicionado`
        })
        this.loadPlayers()
      }
    })
    this.loadPlayers()
  }


  openDetailsModal(player: Player) {
    const ref = this.dialog.open(EditarJogadorModalComponent, {
      header: '',
      width: '70vw',
      contentStyle: { padding: '0' },
      dismissableMask: true,
      closable: false,
      styleClass: 'no-dialog-wrapper',
      data: { jogador: player }
    })

    ref.onClose.subscribe(result => {
      if (result) {
        this.message.add({
          severity: 'success',
          summary: 'Jogador atualizado',
          detail: `Jogador ${player.Nome} foi editado com sucesso`
        })
        this.loadPlayers()
      }
    })
  }

  openDrawModal() {
      if (this.selectedPlayers.length === 0) {
        this.message.add({
          severity: 'warn',
          summary: 'Nenhum jogador selecionado',
          detail: 'Selecione ao menos um jogador para sortear'
        })
        return
      }

      const ref = this.dialog.open(DrawModalComponent, {
        header: '',
        width: '400px',
        contentStyle: { padding: '0' },
        dismissableMask: true,
        closable: false,
        styleClass: 'no-dialog-wrapper',
        data: { jogadores: this.selectedPlayers }
      })

      ref.onClose.subscribe((result) => {
        if (result) {
          // Aqui você pode exibir os times ou navegar para uma página de exibição
          console.log('Times sorteados:', result)
        }
      })
    }

  clear(table: any) {
    table.clear()
  }

  getSelectedCount(): number {
    return this.selectedPlayers.length
  }
}
