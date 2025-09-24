import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import { ContactUs } from './pages/contact-us/contact-us';
import { Products } from './pages/products/products';
import { Careers } from './pages/careers/careers';
export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'quem-somos',
        component: AboutUs
    },
    {
        path: 'contato',
        component: ContactUs
    },
    {
        path: 'produtos',
        component: Products
    },
    {
        path: 'vagas',
        component: Careers
    },
    {
        path: '**',
        redirectTo: ''
    }
];
