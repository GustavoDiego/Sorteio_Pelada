import { Player } from '../models/player.model'
import { storage } from './storage'

export interface DrawState {
    jogadores: Player[]
    jogadoresPorTime: number
}

const DRAW_STATE_KEY = 'drawState'

export const drawStateStorage = {
    get(): DrawState | null {
        return storage.get<DrawState>(DRAW_STATE_KEY)
    },

    set(partial: Partial<DrawState>): void {
        const current = storage.get<DrawState>(DRAW_STATE_KEY) ?? {
            jogadores: [],
            jogadoresPorTime: 0
        }

        storage.set<DrawState>(DRAW_STATE_KEY, { ...current, ...partial })
    },

    clear(): void {
        storage.remove(DRAW_STATE_KEY)
    }
}
