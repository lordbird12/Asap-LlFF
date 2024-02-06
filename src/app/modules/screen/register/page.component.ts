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
import { LicenseComponent } from './license/page.component';
import { KgComponent } from './kg/page.component';
import { PolicyComponent } from './policy/page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageService } from './page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
        LicenseComponent,
        KgComponent,
        PolicyComponent,
    ],
})
export class PageComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'policy';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    activeBtn: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.activeBtn = false;
        // Setup available panels
        this.panels = [
            {
                id: 'policy',
                icon: 'heroicons_outline:user-circle',
                title: 'Account',
                description:
                    'Manage your public profile and private information',
            },
            {
                id: 'license',
                icon: 'heroicons_outline:lock-closed',
                title: 'Security',
                description:
                    'Manage your password and 2-step verification preferences',
            },
            {
                id: 'kg',
                icon: 'heroicons_outline:credit-card',
                title: 'Plan & Billing',
                description:
                    'Manage your subscription plan, payment method and billing information',
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
        if (this.selectedPanel == '' || this.selectedPanel == 'policy') {
            this.selectedPanel = 'license';
        } else if (this.selectedPanel == 'license') {
            var json = sessionStorage.getItem('license')
                ? JSON.parse(sessionStorage.getItem('license'))
                : [];
            this._service.getById(json.license).subscribe((resp: any) => {
                // this.item = resp.data;
                if (resp.data) {
                    const obj = {
                        data: resp.data,
                    };
    
                    sessionStorage.setItem('data', JSON.stringify(obj));
                    this._changeDetectorRef.markForCheck();
                    this.selectedPanel = 'kg';
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
            
        } else {
            this.Submit();
            return;
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
                var license = sessionStorage.getItem('license')
                    ? JSON.parse(sessionStorage.getItem('license'))
                    : [];
                var mlie = sessionStorage.getItem('mlie')
                    ? JSON.parse(sessionStorage.getItem('mlie'))
                    : [];

                this._service.create(license, mlie).subscribe({
                    next: (resp: any) => {
                        this._router.navigate(['screens/services']);
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
}
