import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { PostponDateComponent } from './postpon-date/page.component';
import { PostponTimeComponent } from './postpon-time/page.component';

export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'date',
                component: PostponDateComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'time/:date',
                component: PostponTimeComponent,
            },
        ],
    },
  
] as Routes;
