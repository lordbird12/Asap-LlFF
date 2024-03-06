import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { HomeMainComponent } from './main/page.component';
import { PageBookingComponent } from './booking/page.component';

export default [
    {
        path: '',
        component: HomeMainComponent,
    },
    {
        path: 'booking',
        component: PageBookingComponent,
    },
] as Routes;
