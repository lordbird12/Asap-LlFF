import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
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
    MatBottomSheetModule,
    MAT_BOTTOM_SHEET_DATA,
    MatBottomSheet,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';
import { Router } from '@angular/router';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'app/toast.service';

@Component({
    selector: 'confirm',
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
export class ConfirmComponent implements OnInit, OnDestroy {
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
    toasts = [];
    date_format: any;
    months: any = [
        '',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<ConfirmComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _router: Router,
        private _service: PageService,
        private _bottomSheet: MatBottomSheet,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog,
        private toastService: ToastService
    ) {}
    ngAfterViewInit() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        console.log(this.data);
        if (this.data.date) {
            this.date_format = this.data.date.split('-');
        }
        this._changeDetectorRef.markForCheck();
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

    removeToast(id: string) {
        this.toastService.removeToast(id);
    }

    openPostpon(): void {
        this._bottomSheetRef.dismiss();
        this._router.navigate(['screens/postpon/finish']);
    }

    closeBottomSheet(status: any): void {
        this._bottomSheetRef.dismiss(status);
        event.preventDefault();
      }
    

    submit(): void {
        const data = {
            booking_id: this.data.id,
            date: this.data.date,
            time: this.data.time,
        };

        this._service.postpon_date_time(data).subscribe({
            next: (resp: any) => {
                this.closeBottomSheet(true);
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
