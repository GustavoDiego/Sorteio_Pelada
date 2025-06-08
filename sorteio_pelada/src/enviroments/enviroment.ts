interface HostConfig {
  protocol: string
  host: string
  port: string
  root: string
  endpoints: Record<string, string>
}

interface AppEnvironment {
  production: boolean
  hosts: Record<string, HostConfig>
}



export const environment : AppEnvironment= {
  production: false,
  hosts: {
    api: {
      protocol: 'http',
      host: 'localhost',
      port: '3000',
      root: '', // sem "/api"
      endpoints: {
        'login': 'auth/login',
        'register': 'auth/register',
        'me': 'auth/profile',
        'jogadores': 'players',
        'jogador-detalhe': 'players/:id',
        'criar-jogador': 'players',
        'editar-jogador': 'players/:id',
        'deletar-jogador': 'players/:id',
        'sortear': 'draw'
      }
    }
  }
}
