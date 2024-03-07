import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { HomeMainComponent } from './main/page.component';
import { PageBookingComponent } from './booking/page.component';
import { FinishComponent } from './finish/page.component';
import { CarsComponent } from './cars/page.component';

export default [
    {
        path: '',
        component: HomeMainComponent,
    },
    {
        path: 'booking',
        component: PageBookingComponent,
    },
    {
        path: 'detail',
        component: FinishComponent,
    },
    {
        path: 'cars',
        component: CarsComponent,
    },
] as Routes;
