import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'success',
      text: 'NOVO'
    }
  },
  {
    name: 'Contato',
    url: '/contact',
    iconComponent: { name: 'cil-paper-plane' },
    badge: {
      color: 'info',
      text: 'IMPORTANTE'
    }
  },
];
