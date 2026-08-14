import { provideHttpClient } from '@angular/common/http'    ;
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './global-error-handler';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter( routes),
        provideHttpClient(),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ],
};