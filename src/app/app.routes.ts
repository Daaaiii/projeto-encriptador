import { Routes } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { DiffieHellmanComponent } from './components/diffie-hellman/diffie-hellman.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cripto', pathMatch: 'full' },
  { path: 'cripto', component: FormularioComponent },
  { path: 'diffie-hellman', component: DiffieHellmanComponent }
];
