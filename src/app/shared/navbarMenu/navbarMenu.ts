import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar-menu',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './navbarMenu.html',
    styleUrls: ['./navbarMenu.css']
})
export class NavbarMenuComponent {}