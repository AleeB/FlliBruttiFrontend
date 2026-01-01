    import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/home/index.component').then(m => m.IndexComponent) },
	{ path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
	{ path: 'ncc', title: 'NCC', loadComponent: () => import('./pages/home/index.component').then(m => m.IndexComponent) },
	{ path: 'movimento-terra', title: 'Movimento Terra', loadComponent: () => import('./pages/home/index.component').then(m => m.IndexComponent) },
	{ path: 'preventivi', title: 'Preventivi', loadComponent: () => import('./pages/preventivi/preventivi.component').then(m => m.PreventiviComponent) }
];
	