import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
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
import {
    MatFormFieldControl,
    MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';
import { Router } from '@angular/router';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { PageService } from '../page.service';
import { CancelDialogComponent } from '../cancel/page.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'start',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./page.component.scss'],
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
        MatInputModule,
        ReactiveFormsModule,
        NgxStarsModule,
        MatBottomSheetModule,
    ],
})
export class StatusComponent implements OnInit, OnDestroy {
    @ViewChild(NgxStarsComponent)
    starsComponent: NgxStarsComponent;
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'main';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    phone: string = '085-036-0033';
    // otp: string[] = new Array(6).fill('');
    otpForm: FormGroup;
    public lat;
    public lng;
    /**
     * Constructor
     */
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<StatusComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _router: Router,
        private _service: PageService,
        private _bottomSheet: MatBottomSheet,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog
    ) {}
    ngAfterViewInit() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {}

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

    selectMap() {
        this._bottomSheetRef.dismiss();
        this._router.navigate(['screens/search/main']);
    }

    // openCancel(): void {
    //     this._bottomSheetRef.dismiss();

    //     this._bottomSheet.open(CancelDialogComponent, {
    //         panelClass: 'my-component-bottom-sheet',
    //     });
    // }

    openCancel() {
        const dialogRef = this.dialog.open(CancelDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                data: 1,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const confirmation = this._fuseConfirmationService.open({
                    title: 'เปลี่ยนสถานะ',
                    message: 'คุณต้องการเปลี่ยนสถานะใช่หรือไม่ ',
                    icon: {
                        show: false,
                        name: 'heroicons_outline:exclamation',
                        color: 'warning',
                    },
                    actions: {
                        confirm: {
                            show: true,
                            label: 'ยืนยัน',
                            color: 'primary',
                        },
                    },
                    dismissible: true,
                });

                // Subscribe to the confirmation dialog closed action
                confirmation.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        this._bottomSheet.dismiss();
                        // this.multiItems.map((item: any) => {
                        //     const reason = result;
                        //     const formValue = item;
                        //     const services = item.services.map((data) => ({
                        //         service_id: data.service_id,
                        //     }));
                        //     this._service
                        //         .updateStatus(
                        //             formValue.id,
                        //             this.status.value,
                        //             reason,
                        //             services
                        //         )
                        //         .subscribe({
                        //             next: (resp: any) => {
                        //                 this.multiItems = [];
                        //                 this.isChecked1 = [];
                        //                 this.isChecked2 = [];
                        //                 const data = {
                        //                     users: this.employeeDep.filter(
                        //                         (e) => e.isSelected
                        //                     ),
                        //                 };
                        //                 this.task = [
                        //                     {
                        //                         id: 1,
                        //                         name: 'งานใหม่ / Todo',
                        //                         detail: 'งานใหม่รอรับ',
                        //                         status: 'Process',
                        //                         task: [],
                        //                     },
                        //                     {
                        //                         id: 2,
                        //                         name: 'กำลังดำเนินงาน',
                        //                         detail: 'โทรจองศูนย์ซ่อมและโทรยืนยันลูกค้า',
                        //                         status: 'Waiting',
                        //                         task: [],
                        //                     },
                        //                     {
                        //                         id: 3,
                        //                         name: 'รอเข้ารับบริการ',
                        //                         detail: 'โทรยืนยันการเข้ารับบริการกับทางศูนย์',
                        //                         status: 'Finish',
                        //                         task: [],
                        //                     },
                        //                     {
                        //                         id: 4,
                        //                         name: 'เสร็จสิ้น',
                        //                         detail: '-',
                        //                         status: 'Cancel',
                        //                         task: [],
                        //                     },
                        //                 ];
                        //                 this._service
                        //                     .getBookingByDep(
                        //                         this.user.department_id,
                        //                         data
                        //                     )
                        //                     .subscribe((resp: any) => {
                        //                         const news = resp.data.news;
                        //                         const all = resp.data.all;
                        //                         // console.log(resp.data.all)
                        //                         for (const item of news) {
                        //                             if (item.status === 'New') {
                        //                                 this.task[0].task.push(
                        //                                     item
                        //                                 );
                        //                             }
                        //                         }
                        //                         for (const item of all) {
                        //                             if (
                        //                                 item.status ===
                        //                                 'Process'
                        //                             ) {
                        //                                 this.task[1].task.push(
                        //                                     item
                        //                                 );
                        //                             } else if (
                        //                                 item.status ===
                        //                                 'Waiting'
                        //                             ) {
                        //                                 this.task[2].task.push(
                        //                                     item
                        //                                 );
                        //                             } else if (
                        //                                 item.status === 'Finish'
                        //                             ) {
                        //                                 this.task[3].task.push(
                        //                                     item
                        //                                 );
                        //                             } else if (
                        //                                 item.status === 'Cancel'
                        //                             ) {
                        //                                 this.task[0].task.push(
                        //                                     item
                        //                                 );
                        //                             }
                        //                         }
                        //                         this._changeDetectorRef.detectChanges();
                        //                     });
                        //             },
                        //             error: (err: any) => {
                        //                 this._fuseConfirmationService.open({
                        //                     title: 'กรุณาระบุข้อมูล',
                        //                     message: err.error.message,
                        //                     icon: {
                        //                         show: true,
                        //                         name: 'heroicons_outline:exclamation',
                        //                         color: 'warning',
                        //                     },
                        //                     actions: {
                        //                         confirm: {
                        //                             show: false,
                        //                             label: 'ยืนยัน',
                        //                             color: 'primary',
                        //                         },
                        //                         cancel: {
                        //                             show: false,
                        //                             label: 'ยกเลิก',
                        //                         },
                        //                     },
                        //                     dismissible: true,
                        //                 });
                        //             },
                        //         });
                        // });
                    }
                });
            }
        });
    }
}
