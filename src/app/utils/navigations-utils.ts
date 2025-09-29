import { signal } from "@angular/core";

export class NavigationUtils {
    static selected = signal('home');
    
    static readonly MENU_ITEMS = [
        { name: 'home', label: 'Página Inicial', link: '/' },
        { name: 'about', label: 'Quem Somos', link: '/quem-somos' },
        { name: 'services', label: 'Produtos', link: '/produtos' },
        { name: 'contact', label: 'Contato', link: '/contato' },
        { name: 'careers', label: 'Trabalhe Conosco', link: '/trabalhe-conosco' }
    ];
}