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

@Component({
  standalone: true,
  imports : [ NavbarComponent,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    CheckboxModule],
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class HomePage implements OnInit {
  players: Player[] = []
  selectedPlayers: Player[] = []
  loading = false
  searchValue = ''

  constructor(
    private playerService: PlayersService,
    private confirmation: ConfirmationService,
    private message: MessageService
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
    // abrir modal de criação
  }

  openDetailsModal(player: Player) {
    // abrir modal de edição
  }

  openDrawModal() {
    // abrir modal de sorteio
  }

  clear(table: any) {
    table.clear()
  }

  getSelectedCount(): number {
    return this.selectedPlayers.length
  }
}
