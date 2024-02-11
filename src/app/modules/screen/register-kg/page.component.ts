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
import { KgComponent } from './kg/page.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageService } from './page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { getCookie, setCookie } from 'typescript-cookie';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'page',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        KgComponent,
        MatOptionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],
})
export class PageComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'policy';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    dataForm: UntypedFormGroup;
    activeBtn: any;
    licensePlate: string = '';
    disableBtn: boolean = true;

    Id:any;
    item:any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.dataForm = this._formBuilder.group({
            mlie: [
                '',
                [Validators.required, Validators.pattern(/^([A-Z0-9]{1,7})$/)],
            ],
        });
        
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
       
        this._service.getById(this.Id).subscribe((resp: any) => {
            this.item = resp.data;
            if (resp.data) {
                const obj = {
                    data: resp.data,
                };

                // sessionStorage.setItem('data', JSON.stringify(obj));
                // setCookie('data', JSON.stringify(obj))
                this._changeDetectorRef.markForCheck();
                // this._router.navigate(['screens/services/'+resp.data.id]);
            } else {
                this._fuseConfirmationService.open({
                    title: 'เกิดข้อผิดพลาด',
                    message: 'ไม่พบข้อมูลรถในระบบ กรุณาตรวจสอบข้อมูล',
                    icon: {
                        show: true,
                        name: 'heroicons_outline:exclamation',
                        color: 'warning',
                    },
                    actions: {
                        confirm: {
                            show: false,
                            label: 'ตกลง',
                            color: 'primary',
                        },
                        cancel: {
                            show: false,
                            label: 'ยกเลิก',
                        },
                    },
                    dismissible: true,
                });
            }

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

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(): void {
        this.Submit();
        // this.selectedPanel = panel;
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

    showOptions(event) {
        if (event.checked) {
            this.activeBtn = true;
        } else {
            this.activeBtn = false;
        }
    }

    Submit(): void {
        // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
        // console.log(end)
        // this.addForm.patchValue({
        //   register_date:end
        // })
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มข้อมูล',
            message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ตกลง',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
          

                this._service.create(this.item.license, this.dataForm.value.mlie).subscribe({
                    next: (resp: any) => {
                        this._router.navigate(['screens/services/'+this.Id]);
                    },

                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'เกิดข้อผิดพลาด',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ตกลง',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'ยกเลิก',
                                },
                            },
                            dismissible: true,
                        });
                        console.log(err.error.message);
                    },
                });
            }
        });
    }

    onChange(event: any) {
        if (event.target.value) {
            this.disableBtn = false;
        } else {
            this.disableBtn = true;
        }

        event.target.value = event.target.value
            .replace(/[^0-9]/g, '')
            .toUpperCase();

        const obj = {
            mlie: this.dataForm.value.mlie,
        };

        setCookie('mlie', JSON.stringify(obj));
    }
}
