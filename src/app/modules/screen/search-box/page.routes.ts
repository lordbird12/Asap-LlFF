import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { SearchBoxComponent } from './main/page.component';

export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'main',
                component: SearchBoxComponent,
                resolve  : {
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'form',
                component: SearchBoxComponent,
                resolve  : {
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
] as Routes;
