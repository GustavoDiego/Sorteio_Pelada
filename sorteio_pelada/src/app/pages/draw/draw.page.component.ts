import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { NavbarComponent } from '../../shared/components/navbar/navbar.component'
import { ButtonModule } from 'primeng/button'
import html2canvas from 'html2canvas'
import { finalize } from 'rxjs'
import { Player } from '../../core/models/player.model'
import { DrawService } from '../../core/services/draw.service'
import { DrawState, drawStateStorage } from '../../core/utils/draw-state'

@Component({
  selector: 'app-draw-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ButtonModule],
  templateUrl: './draw.page.component.html',
  styleUrls: ['./draw.page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrawPageComponent implements OnInit {
  times: Player[][] = []
  resortearLoading = false
  @ViewChild('captureArea', { static: false }) captureArea!: ElementRef<HTMLDivElement>

  constructor(
    private router: Router,
    private drawService: DrawService
  ) { }

  ngOnInit(): void {
    const state = history.state
    if (state.times && Array.isArray(state.times)) {
      this.times = state.times
      return
    }

    const stored = drawStateStorage.get()
    if (stored?.jogadores?.length && stored.jogadoresPorTime > 0) {
      this.sortearComEstado(stored)
      return
    }

    this.router.navigate(['/home'])
  }

  resortear() {
    const stored = drawStateStorage.get()
    if (!stored?.jogadores?.length || !stored.jogadoresPorTime) {
      this.router.navigate(['/home'])
      return
    }

    this.resortearLoading = true

    this.sortearComEstado({
      ...stored,
      jogadores: this.shufflePlayers(stored.jogadores)
    })
  }

  private sortearComEstado(state: DrawState): void {
    const numeroDeTimes = Math.ceil(state.jogadores.length / state.jogadoresPorTime)

    this.drawService
      .sortear(state.jogadores, numeroDeTimes, state.jogadoresPorTime)
      .pipe(
        finalize(() => {
          this.resortearLoading = false
        })
      )
      .subscribe({
        next: times => {
          this.times = times
        },
        error: error => {
          console.error('Falha ao resortear:', error)
        }
      })
  }

  private shufflePlayers(players: Player[]): Player[] {
    const shuffled = [...players]
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }

  async compartilhar() {
    if (!this.captureArea) return

    const element = this.captureArea.nativeElement


    const actions = document.querySelector('.actions') as HTMLElement
    if (actions) actions.style.display = 'none'

    try {
      const canvas = await html2canvas(element)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve))
      if (!blob) throw new Error('Erro ao gerar imagem')

      const file = new File([blob], 'resultado-sorteio.png', { type: blob.type })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Resultado do Sorteio',
          text: 'Confira os times sorteados!',
          files: [file]
        })
      } else {
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
      alert('Não foi possível compartilhar. Tente capturar a tela manualmente.')
    } finally {
      if (actions) actions.style.display = 'flex'
    }
  }
}
