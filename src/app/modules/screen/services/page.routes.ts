import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ServicesMainComponent } from './main/page.component';
import { StepTwoComponent } from './step-two/page.component';
import { StepTwoMapComponent } from './step-two-map/page.component';
import { ServiceCenterComponent } from './step-two-service-centers/page.component';
import { StepThreeComponent } from './step-three/page.component';
import { StepThreeTimeComponent } from './step-three-time/page.component';

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
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'step-two-service-centers',
                component: ServiceCenterComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'step-three',
                component: StepThreeComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'step-three-time/:date',
                component: StepThreeTimeComponent,
            },
        ],
    },
] as Routes;
