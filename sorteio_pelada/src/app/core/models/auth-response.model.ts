import { User } from './user.model'

export interface AuthResponse {
   access_token: string
   username?: string
   user?: User
}
