import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { HomeMainComponent } from './main/page.component';
import { PageBookingComponent } from './booking/page.component';
import { DetailComponent } from './detail/page.component';

export default [
    {
        path: ':id',
        component: DetailComponent,
    },
    {
        path: 'booking',
        component: PageBookingComponent,
    },
] as Routes;
