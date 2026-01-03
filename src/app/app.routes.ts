    import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/home/index.component').then(m => m.IndexComponent) },
	{ path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
	{ path: 'nccCity', title: 'NCCCity', loadComponent: () => import('./pages/preventivi/nccCity/nccCity.component').then(m => m.NccCityComponent) },
	{ path: 'ncc', title: 'NCC', loadComponent: () => import('./pages/preventivi/ncc/ncc.component').then(m => m.NccComponent) },
	{ path: 'movimento-terra', title: 'Movimento Terra', loadComponent: () => import('./pages/preventivi/movimentoTerra/movimentoTerra.component').then(m => m.MovimentoTerraComponent) },
	{ path: 'preventivi', title: 'Preventivi', loadComponent: () => import('./pages/preventivi/preventivi.component').then(m => m.PreventiviComponent) }
];
	