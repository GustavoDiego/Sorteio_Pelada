import { Injectable } from '@nestjs/common';
import { Player } from 'src/shared/interfaces/player.interface';
import { TeamResult } from 'src/shared/interfaces/teamResult.interface';

@Injectable()
export class DrawService {
  private readonly attrs = ['forca', 'velocidade', 'passe', 'chute', 'corpo', 'esperteza'] as const;


  sortearTimes(jogadores: Player[], numeroDeTimes: number, tamanhoPorTime: number): Player[][] {
    if (jogadores.length < numeroDeTimes) {
      throw new Error('Número de jogadores insuficiente para a quantidade de times');
    }

    if (tamanhoPorTime > 0 && jogadores.length > numeroDeTimes * tamanhoPorTime) {
      throw new Error(
        'Capacidade máxima dos times excedida — aumente o tamanhoPorTime ou o nº de times',
      );
    }

    const players = this.sanitize(jogadores);
    const melhor = this.gerarMelhorDistribuicao(players, numeroDeTimes, tamanhoPorTime, 500);

    if (melhor.metric !== 0) {
      console.warn(
        `Nenhuma distribuição perfeita encontrada. Retornando melhor distribuição com métrica ${melhor.metric}`,
      );
    }

    return melhor.times;
  }

  private gerarMelhorDistribuicao(
    jogadores: Player[],
    k: number,
    tamanho: number,
    tentativas: number,
  ): TeamResult {
    let melhorMetric = Number.POSITIVE_INFINITY;
    let melhor: Player[][] = [];

    for (let i = 0; i < tentativas; i++) {
      const grupos = this.distribuir(this.shuffle(jogadores), k, tamanho);
      const metric = this.metric(grupos);
      console.log(`Tentativa ${i + 1}: ${metric}`);

      if (metric < melhorMetric) {
        melhorMetric = metric;
        melhor = grupos;
        if (metric === 0) break;
      }
    }

    return { times: melhor, metric: melhorMetric };
  }


  private distribuir(jogadores: Player[], k: number, tamanho: number): Player[][] {
    if (tamanho > 0) {
      const times: Player[][] = [];
      let idx = 0;
      for (let i = 0; i < k; i++) {
        const restante = jogadores.length - idx;
        const capacidade = i === k - 1 ? restante : Math.min(tamanho, restante);
        times.push(jogadores.slice(idx, idx + capacidade));
        idx += capacidade;
      }
      return times;
    }


    const times: Player[][] = Array.from({ length: k }, () => []);
    jogadores.forEach((j, i) => times[i % k].push(j));
    return times;
  }

  private metric(times: Player[][]): number {
    const global = this.mean(times.flat());
    return times.reduce((total, time) => {
      const media = this.mean(time);
      const somaTime = this.attrs.reduce((acc, attr) => {
        const diff = media[attr] - global[attr];
        return acc + diff * diff;
      }, 0);
      return total + somaTime;
    }, 0);
  }

  private mean(jogadores: Player[]): Record<(typeof this.attrs)[number], number> {
    const sums = this.attrs.reduce((acc, attr) => ({ ...acc, [attr]: 0 }), {} as any);
    jogadores.forEach((j) => this.attrs.forEach((attr) => (sums[attr] += (j as any)[attr])));
    const divisor = jogadores.length || 1;
    return this.attrs.reduce((acc, attr) => ({ ...acc, [attr]: sums[attr] / divisor }), {} as any);
  }

  private sanitize(players: Player[]): Player[] {
    return players.map((p) => {
      const copy: any = { ...p };
      this.attrs.forEach((attr) => {
        const val = this.extractAttr(p, attr);
        copy[attr] = Number.isFinite(val) ? val : attr === 'chute' ? 3 : 0;
      });
      return copy;
    });
  }

  private extractAttr(player: any, attr: string): number {
    const norm = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const target = norm(attr);
    for (const key of Object.keys(player)) {
      if (norm(key) === target) return Number(player[key]);
    }
    return NaN;
  }

  private shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }
}
