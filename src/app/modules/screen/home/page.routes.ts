import { Routes } from '@angular/router';
import { PageComponent } from 'app/modules/screen/home/page.component';
import { PageBookingComponent } from 'app/modules/screen/home/booking/page.component';

export default [
    {
        path     : '',
        component: PageComponent,
    },
    {
        path     : 'booking',
        component: PageBookingComponent,
    },
] as Routes;
