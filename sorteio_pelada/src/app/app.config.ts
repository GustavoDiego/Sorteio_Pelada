import { provideAnimations } from '@angular/platform-browser/animations'
import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { ToastModule } from 'primeng/toast'
import { TableModule } from 'primeng/table'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { authInterceptor } from './core/interceptors/interceptor'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import Lara from '@primeng/themes/lara'
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    }),
    importProvidersFrom(
      ToastModule,
      TableModule,
      DialogModule,
      ButtonModule,
      InputTextModule,
      DropdownModule,

    )
  ]
}
