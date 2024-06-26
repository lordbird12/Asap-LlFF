import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FuseCardComponent } from '@fuse/components/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { OtpComponent } from './../otp/page.component';
import { StarsComponent } from './../stars/page.component';
import { PageService } from '../page.service';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'confirm',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        NgClass,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        MatMenuModule,
        FuseCardComponent,
        MatDividerModule,
        MatFormFieldModule,
        MatButtonModule,
        MatBottomSheetModule,
    ],
})
export class ConfirmComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'main';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    item: any;
    service: any;
    services: any[] = [];
    sevice_date_time: any;
    contact: any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _bottomSheet: MatBottomSheet,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    openBottomSheet(): void {
        this._bottomSheet.open(StarsComponent);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.item = localStorage.getItem('data')
            ? JSON.parse(localStorage.getItem('data')).data
            : [];

        this.service = localStorage.getItem('myServiceCenter')
            ? JSON.parse(localStorage.getItem('myServiceCenter'))
            : [];

        this.sevice_date_time = localStorage.getItem('sevice_date_time')
            ? JSON.parse(localStorage.getItem('sevice_date_time'))
            : [];

        this.contact = localStorage.getItem('contact')
            ? JSON.parse(localStorage.getItem('contact'))
            : [];

        this.services = localStorage.getItem('services')
            ? JSON.parse(localStorage.getItem('services'))
            : [];
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(): void {
        if (this.selectedPanel == '') {
            this.selectedPanel = 'main';
        } else if (this.selectedPanel == 'main') {
            this.selectedPanel = 'list';
        }

        console.log(this.selectedPanel);
        // this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    submit() {
        const contact = localStorage.getItem('contact')
            ? JSON.parse(localStorage.getItem('contact'))
            : [];

        const sevice_date_time = localStorage.getItem('sevice_date_time')
            ? JSON.parse(localStorage.getItem('sevice_date_time'))
            : [];

        const data2 = localStorage.getItem('data')
            ? JSON.parse(localStorage.getItem('data'))
            : [];

        const myServiceCenter = localStorage.getItem('myServiceCenter')
            ? JSON.parse(localStorage.getItem('myServiceCenter'))
            : [];

        const services = localStorage.getItem('services')
            ? JSON.parse(localStorage.getItem('services'))
            : [];

        const service_checks = [];

        services.forEach((element) => {
            if (element.check) {
                service_checks.push({
                    service_id: element.id,
                });
            }
        });

        if (contact && sevice_date_time) {
            const data_book = {
                client_id: data2.data.client_id,
                car_id: data2.data.id,
                phone: contact.phone,
                name: contact.name,
                service_center_id: myServiceCenter.id,
                reason: '',
                date: sevice_date_time.date,
                time: sevice_date_time.time,
                services: service_checks,
            };

            this._service.booking(data_book).subscribe({
                next: (resp: any) => {
                    this._router.navigate(['screens/booking/finish']);
                },

                error: (err: any) => {
                    this._fuseConfirmationService.open({
                        title: 'เกิดข้อผิดพลาด',
                        message: err.error.message,
                        icon: {
                            show: true,
                            name: 'heroicons_outline:exclamation-triangle',
                            color: 'accent',
                        },
                        actions: {
                            confirm: {
                                show: true,
                                label: 'ปิด',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                                label: 'ยกเลิก',
                            },
                        },
                        dismissible: true,
                    });
                    // console.log(err.error.message);
                },
            });
        }
    }

    convertDateFormat(inputDateString: string): string {
        // Parse the input date string
        const [year, month, day] = inputDateString.split('-').map(Number);

        // Check if the date is valid
        if (isNaN(year)) {
            return 'Invalid year';
        }

        if (isNaN(month)) {
            return 'Invalid month';
        }

        if (isNaN(day)) {
            return 'Invalid day';
        }

        // Create a new Date object with the provided year, month (subtracting 1 as months are 0-indexed), and day
        const dateObject: Date = new Date(year, month - 1, day);

        // Check if the Date object is valid
        if (isNaN(dateObject.getTime())) {
            return 'Invalid date';
        }

        // Format the date to 'dddd, dd MMMM yyyy' (e.g., 'Thursday, 11 June 2023')
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const formattedDate: string = dateObject.toLocaleDateString(
            'en-US',
            options
        );

        return formattedDate;
    }
}
