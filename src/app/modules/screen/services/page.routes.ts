import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ServicesMainComponent } from './main/page.component';
import { StepTwoComponent } from './step-two/page.component';
import { StepTwoMapComponent } from './step-two-map/page.component';

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
                path: 'main',
                component: ServicesMainComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'step-two',
                component: StepTwoComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'step-two-map',
                component: StepTwoMapComponent,
            },
        ],
    },
] as Routes;
