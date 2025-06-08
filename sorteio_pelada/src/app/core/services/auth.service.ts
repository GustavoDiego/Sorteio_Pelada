import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { resolve } from '../utils/resolve'
import { storage } from '../utils/storage'
import { LoginDto } from '../models/login.dto'
import { RegisterDto } from '../models/register.dto'
import { AuthResponse } from '../models/auth-response.model'
import { User } from '../models/user.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: LoginDto): Observable<AuthResponse> {
   return this.http.post<{ access_token: string }>(resolve('api://login'), data).pipe(
    tap(res => {
      storage.set('token', res.access_token)
    })
  )
}

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(resolve('api://register'), data).pipe(
      tap(res => {
      storage.set('token', res.access_token)
    })
    )
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(resolve('api://me')).pipe(
      tap(user => storage.set('user', user))
    )
  }

  logout(): void {
    storage.remove('token')
    storage.remove('user')
  }

  getToken(): string | null {
    return storage.get<string>('token')
  }

  getUser(): User | null {
    return storage.get<User>('user')
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }
}
