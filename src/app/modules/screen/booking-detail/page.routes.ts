import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { SnackBarComponent } from './snackbar/page.component';
import { PageBookingComponent } from './booking/page.component';
import { DetailComponent } from './detail/page.component';
import { DetailCancelComponent } from './detail-cancel/page.component';

export default [
    {
        path: ':id',
        component: DetailComponent,
    },
    {
        path: 'booking',
        component: PageBookingComponent,
    },
    {
        path: 'cancel/:id',
        component: DetailCancelComponent,
    }
] as Routes;
