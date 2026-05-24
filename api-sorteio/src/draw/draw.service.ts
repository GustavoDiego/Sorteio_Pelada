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
    const tamanhos = this.calcularTamanhos(players.length, numeroDeTimes, tamanhoPorTime);
    const melhor = this.gerarMelhorDistribuicao(players, tamanhos, 80);

    if (melhor.metric !== 0) {
      console.warn(
        `Nenhuma distribuição perfeita encontrada. Retornando melhor distribuição com métrica ${melhor.metric}`,
      );
    }

    return melhor.times;
  }

  private gerarMelhorDistribuicao(
    jogadores: Player[],
    tamanhos: number[],
    tentativas: number,
  ): TeamResult {
    const base = this.construirETunar(this.ordenarPorPontuacao(jogadores), tamanhos, 1500);
    let melhor = base;

    const limite = Math.max(10, Math.min(tentativas, jogadores.length * 6));
    for (let i = 0; i < limite; i++) {
      const tentativa = this.construirETunar(this.shuffle(jogadores), tamanhos, 800);
      if (tentativa.metric < melhor.metric) {
        melhor = tentativa;
        if (melhor.metric === 0) break;
      }
    }

    return melhor;
  }

  private construirETunar(jogadores: Player[], tamanhos: number[], maxSwaps: number): TeamResult {
    const times = this.distribuirGuloso(jogadores, tamanhos);
    return this.otimizarTrocas(times, maxSwaps);
  }

  private distribuirGuloso(jogadores: Player[], tamanhos: number[]): Player[][] {
    const times: Player[][] = tamanhos.map(() => []);
    const counts = tamanhos.map(() => 0);
    const sums = tamanhos.map(() => this.attrs.map(() => 0));
    const teamCosts = tamanhos.map(() => 0);
    const globalMean = this.meanVector(jogadores);

    for (const jogador of jogadores) {
      let bestTeam = -1;
      let bestDelta = Number.POSITIVE_INFINITY;
      let bestNewCost = 0;

      for (let t = 0; t < times.length; t++) {
        if (counts[t] >= tamanhos[t]) continue;
        const newCost = this.projectedTeamCost(sums[t], counts[t] + 1, jogador, globalMean);
        const delta = newCost - teamCosts[t];
        if (delta < bestDelta) {
          bestDelta = delta;
          bestNewCost = newCost;
          bestTeam = t;
        }
      }

      if (bestTeam === -1) break;
      times[bestTeam].push(jogador);
      counts[bestTeam] += 1;
      this.attrs.forEach((attr, idx) => {
        sums[bestTeam][idx] += (jogador as any)[attr];
      });
      teamCosts[bestTeam] = bestNewCost;
    }

    return times;
  }

  private otimizarTrocas(times: Player[][], maxSwaps: number): TeamResult {
    const globalMean = this.meanVector(times.flat());
    const sums = times.map((time) => this.teamSumVector(time));
    const counts = times.map((time) => time.length);
    const teamCosts = sums.map((sum, idx) => this.teamCost(sum, counts[idx], globalMean));
    let totalMetric = teamCosts.reduce((acc, cur) => acc + cur, 0);

    let swaps = 0;
    while (swaps < maxSwaps) {
      let bestDelta = 0;
      let bestSwap: { a: number; b: number; i: number; j: number; newCostA: number; newCostB: number } | null = null;

      for (let a = 0; a < times.length; a++) {
        for (let b = a + 1; b < times.length; b++) {
          const teamA = times[a];
          const teamB = times[b];
          if (!teamA.length || !teamB.length) continue;

          for (let i = 0; i < teamA.length; i++) {
            for (let j = 0; j < teamB.length; j++) {
              const playerA = teamA[i];
              const playerB = teamB[j];
              const { delta, newCostA, newCostB } = this.swapDelta(
                sums[a],
                sums[b],
                counts[a],
                counts[b],
                playerA,
                playerB,
                globalMean,
                teamCosts[a],
                teamCosts[b],
              );

              if (delta < bestDelta) {
                bestDelta = delta;
                bestSwap = { a, b, i, j, newCostA, newCostB };
              }
            }
          }
        }
      }

      if (!bestSwap || bestDelta >= 0) break;

      const teamA = times[bestSwap.a];
      const teamB = times[bestSwap.b];
      const playerA = teamA[bestSwap.i];
      const playerB = teamB[bestSwap.j];
      teamA[bestSwap.i] = playerB;
      teamB[bestSwap.j] = playerA;

      this.attrs.forEach((attr, idx) => {
        sums[bestSwap.a][idx] = sums[bestSwap.a][idx] - (playerA as any)[attr] + (playerB as any)[attr];
        sums[bestSwap.b][idx] = sums[bestSwap.b][idx] - (playerB as any)[attr] + (playerA as any)[attr];
      });

      teamCosts[bestSwap.a] = bestSwap.newCostA;
      teamCosts[bestSwap.b] = bestSwap.newCostB;
      totalMetric += bestDelta;
      swaps += 1;
    }

    return { times, metric: totalMetric };
  }

  private swapDelta(
    sumA: number[],
    sumB: number[],
    countA: number,
    countB: number,
    playerA: Player,
    playerB: Player,
    globalMean: number[],
    oldCostA: number,
    oldCostB: number,
  ): { delta: number; newCostA: number; newCostB: number } {
    let newCostA = 0;
    let newCostB = 0;

    for (let idx = 0; idx < this.attrs.length; idx++) {
      const attr = this.attrs[idx];
      const aVal = (playerA as any)[attr];
      const bVal = (playerB as any)[attr];

      const meanA = (sumA[idx] - aVal + bVal) / (countA || 1);
      const meanB = (sumB[idx] - bVal + aVal) / (countB || 1);

      const diffA = meanA - globalMean[idx];
      const diffB = meanB - globalMean[idx];
      newCostA += diffA * diffA;
      newCostB += diffB * diffB;
    }

    const delta = newCostA + newCostB - (oldCostA + oldCostB);
    return { delta, newCostA, newCostB };
  }

  private projectedTeamCost(
    sum: number[],
    count: number,
    jogador: Player,
    globalMean: number[],
  ): number {
    let cost = 0;
    for (let idx = 0; idx < this.attrs.length; idx++) {
      const attr = this.attrs[idx];
      const mean = (sum[idx] + (jogador as any)[attr]) / count;
      const diff = mean - globalMean[idx];
      cost += diff * diff;
    }
    return cost;
  }

  private teamCost(sum: number[], count: number, globalMean: number[]): number {
    let cost = 0;
    const divisor = count || 1;
    for (let idx = 0; idx < this.attrs.length; idx++) {
      const mean = sum[idx] / divisor;
      const diff = mean - globalMean[idx];
      cost += diff * diff;
    }
    return cost;
  }

  private teamSumVector(time: Player[]): number[] {
    const sums = this.attrs.map(() => 0);
    for (const jogador of time) {
      this.attrs.forEach((attr, idx) => {
        sums[idx] += (jogador as any)[attr];
      });
    }
    return sums;
  }

  private meanVector(jogadores: Player[]): number[] {
    const sums = this.attrs.map(() => 0);
    for (const jogador of jogadores) {
      this.attrs.forEach((attr, idx) => {
        sums[idx] += (jogador as any)[attr];
      });
    }

    const divisor = jogadores.length || 1;
    return sums.map((sum) => sum / divisor);
  }

  private ordenarPorPontuacao(jogadores: Player[]): Player[] {
    const sorted = [...jogadores].sort((a, b) => {
      const scoreA = this.totalScore(a);
      const scoreB = this.totalScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return String((a as any).Nome ?? '').localeCompare(String((b as any).Nome ?? ''));
    });

    return sorted;
  }

  private totalScore(jogador: Player): number {
    return this.attrs.reduce((acc, attr) => acc + Number((jogador as any)[attr] ?? 0), 0);
  }

  private calcularTamanhos(total: number, k: number, tamanho: number): number[] {
    if (tamanho > 0) {
      const sizes: number[] = [];
      let remaining = total;
      for (let i = 0; i < k; i++) {
        const capacidade = i === k - 1 ? remaining : Math.min(tamanho, remaining);
        sizes.push(capacidade);
        remaining -= capacidade;
      }
      return sizes;
    }

    const base = Math.floor(total / k);
    const extra = total % k;
    return Array.from({ length: k }, (_, i) => base + (i < extra ? 1 : 0));
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
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
