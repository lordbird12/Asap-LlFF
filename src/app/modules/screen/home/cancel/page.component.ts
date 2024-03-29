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
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MAT_BOTTOM_SHEET_DATA,
    MatBottomSheet,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';
import { PageService } from '../page.service';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
    ],
})
export class CancelComponent implements OnInit, OnDestroy {
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
    item: any;
    serviceCenterData: any[] = [];
    activities: any[] = [];
    dataArray: any[] = [];
    topics: any[] = [
        'รถเสียฉุกเฉิน',
        'อุบัติเหตุ',
        'ติดตามรถทดแทน',
        'ติดตามงานบริหารรถยนต์',
        'อื่นๆ',
    ];
    items: any[] = [];
    statusData = new FormControl('');
    checkAll = false;
    selectedItems: any[] = [];
    other: boolean = false;
    dataForm: FormGroup;
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<CancelComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngAfterViewInit() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.dataForm = this._formBuilder.group({
            reason: [null, [Validators.required]],
        });


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

    closeBottomSheet(status: any): void {
        this._bottomSheetRef.dismiss(status);
        event.preventDefault();
    }

    submit(): void {
        const data = {
            booking_id: this.data.id,
            reason: this.dataForm.value.reason,
        };

        this._service.cancel_book(data).subscribe({
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

    onRadioChange(event: any): void {
        if (event.target.value != 'อื่นๆ โปรดระบุเหตุผล') {
            this.other = false;
            this.dataForm.patchValue({
                reason: event.target.value,
            });
        } else if (event.target.value == 'อื่นๆ โปรดระบุเหตุผล') {
            this.other = true;
            this.dataForm.patchValue({
                reason: "",
            });
        }
    }
}
