import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Player } from '../models/player.model'
import { CreatePlayerDto } from '../models/create-player.dto'
import { UpdatePlayerDto } from '../models/update-player.dto'
import { resolve } from '../utils/resolve'

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly http = inject(HttpClient)

  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(resolve('jogadores'))
  }

  getById(id: string): Observable<Player> {
    return this.http.get<Player>(resolve('jogador-detalhe', { id }))
  }

  create(dto: CreatePlayerDto): Observable<Player> {
    return this.http.post<Player>(resolve('criar-jogador'), dto)
  }

  update(id: string, dto: UpdatePlayerDto): Observable<Player> {
    return this.http.put<Player>(resolve('editar-jogador', { id }), dto)
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(resolve('deletar-jogador', { id }))
  }
}
