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
    item: any;
    // public dataRow: any[];
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.dataForm = this._formBuilder.group({
            mlie: [
                null,
                [Validators.required, Validators.pattern('[0-9 ]{11}')],
            ],
        });

        this.item = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')).data : [];
        console.log(this.item);
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
            .replace(/[^0-9]/g, '')
            .toUpperCase();

        const obj = {
            mlie: this.dataForm.value.mlie,
        };

        // setCookie('mlie', JSON.stringify(obj));
    }

    submit() {
        alert(this.dataForm.value.license);
    }
}