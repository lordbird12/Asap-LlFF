import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { EditComponent } from './edit/page.component';
import { MainComponent } from './main/page.component';

export default [

    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'main',
                component: MainComponent,
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'edit',
                component: EditComponent,
            },
        ],
    },
  
] as Routes;
