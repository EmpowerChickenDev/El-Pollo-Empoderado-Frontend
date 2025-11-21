import { Routes } from '@angular/router';
// import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';

import { PromocionesComponent } from './features/promociones/promociones';
import { CartaComponent } from './features/carta/carta';
import { AcompComponent } from './features/acompanamientos/acompanamientos';
import { BebidasComponent } from './features/bebidas/bebidas';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';

export const routes: Routes = [
    // Rutas públicas CON navbar y footer
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', redirectTo: 'promociones', pathMatch: 'full' },
            { path: 'promociones', component: PromocionesComponent },
            { path: 'carta', component: CartaComponent },
            { path: 'acompanamientos', component: AcompComponent },
            { path: 'bebidas', component: BebidasComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ]
    },
    
    // Ruta admin SIN navbar ni footer
    { path: 'admin', component: AdminLayoutComponent },
    
    // Wildcard
    { path: '**', redirectTo: 'promociones' }
];
