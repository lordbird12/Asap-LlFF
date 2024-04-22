import { TextFieldModule } from '@angular/cdk/text-field';
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
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageService } from '../page.service';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MapComponent } from '../map/page.component';

@Component({
    selector: 'step-main',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CdkStepperModule,
        NgStepperModule,
        MatStepperModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatProgressBarModule,
        CommonModule,
        NgClass,
        MatBottomSheetModule,
    ],
})
export class ServicesMainComponent implements OnInit {
    addForm: UntypedFormGroup;
    items: any[] = [];
    items_check: any[] = [];
    item: any;
    service_remark: number;
    service_remark_text: string;

    service_input: boolean;
    activeBtn: any;
    num: any;
    dataForm: FormGroup;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _bottomSheet: MatBottomSheet
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.dataForm = this._formBuilder.group({
            remark: ['', [Validators.required]],
        });

        this.service_input = false;
        this.item = localStorage.getItem('data')
            ? JSON.parse(localStorage.getItem('data')).data
            : [];

        this._service.getServices().subscribe((resp: any) => {
            try {
                this.items = resp.data;
                for (let index = 0; index < this.items.length; index++) {
                    const obj = {
                        check: false,
                        image: this.items[index].image,
                        name: this.items[index].name,
                        remark: this.items[index].remark,
                        type: this.items[index].type,
                        id: this.items[index].id,
                    };

                    // 👇 Push object to array

                    this.items_check.push(obj);
                }
                this.num = this.items_check.length;
                // console.log(this.items_check);
                this._changeDetectorRef.markForCheck();
            } catch (error) {
                console.log(error);
            }
        });
    }

    submit() {
        var n = 0;
        this.items_check.forEach((element) => {
            if (element.type == 'Input') {
                this.items_check[n].remark = this.dataForm.value.remark;
            }
            n++;
        });

        localStorage.setItem('services', JSON.stringify(this.items_check));
        this._bottomSheet.open(MapComponent);
    }

    addService(index) {
        this.service_remark = 0;
        this.service_remark_text = "";
        if (this.items_check[index].check) {
            this.items_check[index].check = false;

            if (this.items_check[index].type == 'Input') {
                this.service_input = false;
            }
        } else {
            this.items_check[index].check = true;
            // this.service_remark = this.items_check[index].remark;

            if (this.items_check[index].type == 'Input') {
                this.service_input = true;
            }
        }
        this.num = this.items_check.length;

        this.items_check.forEach((element) => {
            if (element.check == false) {
                this.num--;
                // if (element.remark) {
                //     this.service_remark =
                //         this.service_remark - Number(element.remark);
                //     if (this.service_remark < 0) {
                //         this.service_remark = 0;
                //     }
                // }
            } else {
                if (element.remark) {
                    this.service_remark =
                        this.service_remark + Number(element.remark);
                        if(this.service_remark == 2){
                            this.service_remark_text = "เช็คระยะต้องจองล่วงหน้าอย่างน้อย 2 วัน";
                        }else{
                            this.service_remark_text = "เช็คระยะและเปลี่ยนยางต้องจองล่วงหน้าอย่างน้อย 3 วัน";
                        }
                }
            }

            if (this.num <= 0) {
                this.activeBtn = false;
            } else {
                this.activeBtn = true;
            }
        });
    }
}
