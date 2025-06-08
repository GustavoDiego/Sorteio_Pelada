import { Injectable } from '@nestjs/common';
import { Player } from 'src/shared/interfaces/player.interface';
import { TeamResult } from 'src/shared/interfaces/teamResult.interface';

@Injectable()
export class DrawService {
  sortearTimes(jogadores: Player[], numeroDeTimes: number, tamanhoPorTime: number): Player[][] {
    if (jogadores.length < numeroDeTimes) {
      throw new Error('Número de jogadores insuficiente para a quantidade de times');
    }

    const permutacaoInicial = this.shuffle(jogadores);
    const melhoresTimes = this.gerarMelhorDistribuicao(
      permutacaoInicial,
      numeroDeTimes,
      tamanhoPorTime,
      500,
    );
    return melhoresTimes.times;
  }

  private gerarMelhorDistribuicao(
    jogadores: Player[],
    k: number,
    tamanho: number,
    tentativas: number,
  ): TeamResult {
    let melhorMetric = Number.MAX_VALUE;
    let melhorDistribuicao: Player[][] = [];
    const baseTolerancia = 0.1; // ponto de partida

    for (let i = 0; i < tentativas; i++) {
      const distribuicao = this.shuffle(jogadores);
      const grupos = this.distribuir(distribuicao, k, tamanho);
      const metric = this.calcularDesvio(grupos);

      // atualiza se encontrou uma distribuição melhor
      if (metric < melhorMetric) {
        melhorMetric = metric;
        melhorDistribuicao = grupos;
      }

      // aplica tolerância crescente após 30 tentativas
      if (i >= 30) {
        const toleranciaAtual = melhorMetric + baseTolerancia * Math.pow(2, (i - 30) / 10);

        if (metric <= toleranciaAtual) {
          melhorDistribuicao = grupos;
          break; // aceitável, encerra cedo
        }
      }
    }

    return { times: melhorDistribuicao, metric: melhorMetric };
  }

  private distribuir(jogadores: Player[], k: number, tamanho: number): Player[][] {
    const total = jogadores.length;
    const base = Math.floor(total / k);
    const extras = total % k; // primeiros `extras` times receberão +1 jogador

    const times: Player[][] = [];
    let index = 0;

    for (let i = 0; i < k; i++) {
      const size = i < extras ? base + 1 : base;
      const time = jogadores.slice(index, index + size);
      times.push(time);
      index += size;
    }

    return times;
  }

  private calcularDesvio(times: Player[][]): number {
    const atributos = ['forca', 'velocidade', 'passe', 'chute', 'corpo', 'esperteza'] as const;
    const mediasPorTime = times.map((time) => {
      const soma = atributos.map((attr) => time.reduce((acc, jogador) => acc + jogador[attr], 0));
      return soma.map((v) => v / time.length);
    });

    const mediasGlobais = atributos.map((_, i) => {
      const soma = mediasPorTime.reduce((acc, time) => acc + time[i], 0);
      return soma / mediasPorTime.length;
    });

    let desvioTotal = 0;
    for (const mediaTime of mediasPorTime) {
      for (let i = 0; i < atributos.length; i++) {
        desvioTotal += Math.pow(mediaTime[i] - mediasGlobais[i], 2);
      }
    }
    return desvioTotal;
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
