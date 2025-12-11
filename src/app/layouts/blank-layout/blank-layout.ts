import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent} from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, Footer],
  templateUrl: './blank-layout.html',
  styleUrls: ['./blank-layout.css']
})
export class BlankLayoutComponent {}
