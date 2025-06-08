import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { NavbarComponent } from '../../shared/components/navbar/navbar.component'
import { ButtonModule } from 'primeng/button'
import html2canvas from 'html2canvas'
import { Player } from '../../core/models/player.model'

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
  @ViewChild('captureArea', { static: false }) captureArea!: ElementRef<HTMLDivElement>

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state
    if (!state.times || !Array.isArray(state.times)) {

      this.router.navigate(['/home'])
    } else {
      this.times = state.times
    }
  }

  resortear() {
    this.router.navigate(['/home'])
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
