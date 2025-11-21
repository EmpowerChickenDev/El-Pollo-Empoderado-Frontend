import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { MenuComponent } from './features/menu/menu.component';

import { PromocionesComponent } from './features/promociones/promociones';
import { CartaComponent } from './features/carta/carta';
import { AcompComponent } from './features/acompanamientos/acompanamientos';
import { BebidasComponent } from './features/bebidas/bebidas';
import { LocalesComponent } from './features/locales/locales.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';

export const routes: Routes = [
    // Rutas públicas (con navbar y footer)
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            
            // Ruta de Menú con subrutas
            {
                path: 'menu',
                component: MenuComponent,
                children: [
                    { path: '', redirectTo: 'promociones', pathMatch: 'full' },
                    { path: 'promociones', component: PromocionesComponent },
                    { path: 'carta', component: CartaComponent },
                    { path: 'acompanamientos', component: AcompComponent },
                    { path: 'bebidas', component: BebidasComponent }
                ]
            },
            
            { path: 'locales', component: LocalesComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ]
    },

    // Rutas administrativas (SIN navbar ni footer)
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminLayoutComponent },
            // Aquí puedes agregar más rutas de admin cuando las crees
            // { path: 'users', component: UsersManagementComponent },
            // { path: 'orders', component: OrdersManagementComponent },
            // etc.
        ]
    },

    { path: '**', redirectTo: '' }
];
