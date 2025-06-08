import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Player } from '../models/player.model'
import { resolve } from '../utils/resolve'

@Injectable({ providedIn: 'root' })
export class DrawService {
  private readonly http = inject(HttpClient)

  sortear(jogadores: Player[], numeroDeTimes: number, tamanhoPorTime: number): Observable<Player[][]> {
    const body = { jogadores, numeroDeTimes, tamanhoPorTime }
    return this.http.post<Player[][]>(resolve('sortear'), body)
  }
}
