import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './blank-layout.html',
  styleUrls: ['./blank-layout.css']
})
export class BlankLayoutComponent {}
