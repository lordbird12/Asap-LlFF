import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DropdownTimeComponent } from 'app/shared/dropdown-time/dropdown-time.component';
import { PageService } from '../page.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxTopicComponent } from 'app/shared/checkbox-topic/checkbox.component';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

@Component({
    selector: 'app-booking-cancel',
    standalone: true,
    imports: [
        MatDividerModule,
        FormsModule,
        CommonModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        DropdownTimeComponent,
        CheckboxTopicComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
})
export class CancelDialogComponent implements OnInit {
    serviceData: any[] = [];
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
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private dialogRef: MatDialogRef<CancelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
    ) {
        console.log('dta', this.data.value);
    }

    ngOnInit(): void {
        this.items = this.data.value;
        // this.updateSelectedItems();
    }

    onClose() {
        this.dialogRef.close();
    }

    checkAllItems() {
        for (const item of this.items) {
            item.isSelected = this.checkAll;
        }
        this.updateSelectedItems();
        this._changeDetectorRef.detectChanges();
    }

    updateSelectedItems() {
        this.selectedItems = this.items.filter((item) => item.isSelected);
        if (this.selectedItems.length !== this.items.length) {
            this.checkAll = false;
        }
    }
    uncheckAllItems() {
        this.checkAll = false;
        for (const item of this.items) {
            item.isSelected = false;
        }
        this.updateSelectedItems();
    }

    onSaveClick(): void {
        // alert(this.statusData.value)
        this.dialogRef.close(true);
        // this._router.navigate(['screens/home/booking']);
    }

    onRadioChange(event: any): void {
        if (event.target.value != 'อื่นๆ โปรดระบุเหตุผล') {
            this.other = false;
        } else if (event.target.value == 'อื่นๆ โปรดระบุเหตุผล') {
            this.other = true;
        }
        return;
    }
}
