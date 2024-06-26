import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ConfirmComponent } from '../confirm/page.component';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet'
import { SnackBarComponent } from '../snackbar/page.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule,
        MatBottomSheetModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    dataForm: FormGroup;
    disableBtn: boolean = true;
    licensePlate: string = '';
    isLoading: boolean = false;
    item: any;
    id: any;
    // public dataRow: any[];
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _activatedRoute: ActivatedRoute,
        private _bottomSheet: MatBottomSheet,
        private _snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        this.id = this._activatedRoute.snapshot.paramMap.get('id');

        this.dataForm = this._formBuilder.group({
            mile: [null, [Validators.required]],
        });

        this._service.getCarById(this.id).subscribe((resp: any) => {
            try {
                this.item = resp;

                this.dataForm.patchValue({ mile: this.item.mile });
                this._changeDetectorRef.markForCheck();
            } catch (error) {
                console.log(error);
            }
        });
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
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
            mile: this.dataForm.value.mile,
        };

        // setCookie('mlie', JSON.stringify(obj));
    }

    removeCar() {
        const bottomSheetRef = this._bottomSheet.open(ConfirmComponent, {
            data: {
                id: this.id
            },
        });

        bottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                this._snackBar.openFromComponent(SnackBarComponent, {
                    duration: 3000,
                    verticalPosition: 'top',
                });

                this._router.navigate(['screens/manage/cars']);
            }
            // this.openSnackBar(
            //     'ยกเลิกการจองสำเร็จ',
            //     'ปิด',
            //     'custom-snackbar',
            //     'end'
            // );
        });
    }

    submit() {
        if (this.dataForm.invalid) {
            return;
        }
        // const confirmation = this._fuseConfirmationService.open({
        //     title: 'เพิ่มข้อมูล',
        //     message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
        //     icon: {
        //         show: false,
        //         name: 'heroicons_outline:exclamation',
        //         color: 'warning',
        //     },
        //     actions: {
        //         confirm: {
        //             show: true,
        //             label: 'ตกลง',
        //             color: 'primary',
        //         },
        //         cancel: {
        //             show: true,
        //             label: 'ยกเลิก',
        //             color: 'primary',
        //         },
        //     },
        //     dismissible: true,
        // });

        // // Subscribe to the confirmation dialog closed action
        // confirmation.afterClosed().subscribe((result) => {
        //     // If the confirm button pressed...
        //     if (result === 'confirmed') {

        this._service
            .create(this.item.license, this.dataForm.value.mile)
            .subscribe({
                next: (resp: any) => {
                    this._router.navigate(['screens/manage/cars']);
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
                    console.log(err.error.message);
                },
            });
        //     }
        // });
    }
}
