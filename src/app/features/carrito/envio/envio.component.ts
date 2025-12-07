import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-envio',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule], // Importamos esto para manejar el formulario
    templateUrl: './envio.component.html',
    styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {

    // Declaramos el grupo del formulario
    envioForm!: FormGroup;

    // Variables para cálculos (puedes traerlas de un servicio más adelante)
    subtotal = 15.90;
    costoEnvio = 5.00;
    total = 0;

    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.iniciarFormulario();
        this.calcularTotal();
    }

    // Inicializamos el formulario con validaciones
    iniciarFormulario() {
        this.envioForm = this.fb.group({
            ciudad: ['Lima', Validators.required],
            distrito: ['Miraflores', Validators.required],
            direccion: ['', [Validators.required, Validators.minLength(5)]],
            nro: [''], // Opcional
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]], // Solo números, 9 dígitos
            referencia: [''],
            nombreRecibe: ['Usuario Actual', Validators.required]
        });
    }

    calcularTotal() {
        this.total = this.subtotal + this.costoEnvio;
    }

    // Función que se ejecuta al dar click en "Ir a Pagar"
    irAPagar() {
        if (this.envioForm.invalid) {
            // Si el formulario no es válido, marcamos todos los campos como "tocados" para mostrar errores
            this.envioForm.markAllAsTouched();
            alert('Por favor completa todos los campos obligatorios (*)');
            return;
        }

        // Aquí capturas los valores para enviarlos al backend o al siguiente paso
        const datosEnvio = this.envioForm.value;
        console.log('Datos listos para procesar:', datosEnvio);

        // Aquí iría tu lógica de navegación: 
        // this.router.navigate(['/pago']);
        alert('Dirección guardada. Yendo al pago...');
    }
}