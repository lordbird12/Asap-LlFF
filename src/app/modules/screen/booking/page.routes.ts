import { Routes } from '@angular/router';
import { PageComponent } from 'app/modules/screen/booking/page.component';
import { OtpComponent } from './otp/page.component';
import { ConfirmComponent } from './confirm/page.component';

export default [
    {
        path     : '',
        component: PageComponent,
    },
    {
        path     : 'confirm',
        component: ConfirmComponent,
    },
    {
        path     : 'otp',
        component: OtpComponent,
    },

] as Routes;
