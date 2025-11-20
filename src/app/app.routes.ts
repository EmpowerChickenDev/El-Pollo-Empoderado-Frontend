import { Routes } from '@angular/router';
// import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';

import { PromocionesComponent } from './features/promociones/promociones';
import { CartaComponent } from './features/carta/carta';
import { AcompComponent } from './features/acompanamientos/acompanamientos';
import { BebidasComponent } from './features/bebidas/bebidas';


export const routes: Routes = [
    { path: '', redirectTo: 'promociones', pathMatch: 'full' }, 
    { path: 'promociones', component: PromocionesComponent },
    { path: 'carta', component: CartaComponent },
    { path: 'acompanamientos', component: AcompComponent },
    { path: 'bebidas', component: BebidasComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: '**', redirectTo: 'promociones' }
];