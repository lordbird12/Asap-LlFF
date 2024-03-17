import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { PostponDateComponent } from './postpon-date/page.component';
import { PostponTimeComponent } from './postpon-time/page.component';
import { FinishComponent } from './finish/page.component';

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
                path: 'date/:id',
                component: PostponDateComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'time/:date/:id',
                component: PostponTimeComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'finish',
                component: FinishComponent,
            },
        ],
    },
] as Routes;
