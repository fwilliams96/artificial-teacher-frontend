import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';

export const registerGuard = () => {
    const router = inject(Router);
    const service = inject(ApiHttpService)

	return !service.isLogged() ? true: router.navigate(['/chat']);
}