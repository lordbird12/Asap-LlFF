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
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
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
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    dataForm: FormGroup;
    disableBtn: boolean = true;
    licensePlate: string = '';
    isLoading: boolean = false;
    positions: any[];
    // public dataRow: any[];
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    private _fuseConfirmationService: any;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.dataForm = this._formBuilder.group({
            license: [
                '',
                [Validators.required, Validators.pattern(/^([A-Z0-9]{1,7})$/)],
            ],
        });
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }
    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 4);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 4);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 4);
        return menu.save === 0;
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                data: element,
            }, // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
            }
        });
    }
    addElement() {
        this._router.navigate(['admin/permission/form']);
    }

    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }

    onChange(event: any) {
        if (event.target.value) {
            this.disableBtn = false;
        } else {
            this.disableBtn = true;
        }

        event.target.value = event.target.value
            .replace(/[^ก-ฮ0-9]/g, '')
            .toUpperCase();
        event.target.value = event.target.value.replace(
            /([ก-ฮ]{2})([0-9]{4})/,
            '$1-$2'
        );

        this.dataForm.patchValue({
            license: event.target.value.slice(0, 8),
        });

        const obj = {
            license: this.dataForm.value.license,
        };

        // sessionStorage.setItem('license', JSON.stringify(obj));

        // document.cookie = "license=" + JSON.stringify(obj);
        // setCookie('license',JSON.stringify(obj));
       
    }

    formatLicensePlate(): void {
        // Implement the logic to format the license plate as per your requirements
        // For example, you can add dashes or other separators
        // Here's a simple example:
        this.licensePlate = this.licensePlate
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase();
        this.licensePlate = this.licensePlate.replace(
            /([A-Z0-9]{3})([A-Z0-9]{3})/,
            '$1-$2'
        );
    }

    submit(){
        this._service.getById(this.dataForm.value.license).subscribe((resp: any) => {
            // this.item = resp.data;
            if (resp.data) {
                const obj = {
                    data: resp.data,
                };

                localStorage.setItem('data', JSON.stringify(obj));
                // setCookie('data', JSON.stringify(obj))
                this._changeDetectorRef.markForCheck();
                this._router.navigate(['screens/reg-kg/list']);
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
    
}
