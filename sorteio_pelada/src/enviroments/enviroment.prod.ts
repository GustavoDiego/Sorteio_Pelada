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



export const environment: AppEnvironment = {
  production: true,
  hosts: {
    api: {
      protocol: 'https',
      host: 'sorteio-pelada.onrender.com',
      port: '',
      root: '',
      endpoints: {
        'login': 'auth/login',
        'register': 'auth/register',
        'me': 'auth/me',
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
