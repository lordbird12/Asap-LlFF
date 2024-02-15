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
    styleUrls: ['./page.component.scss'],
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
export class SearchBoxComponent implements OnInit {
    dataForm: FormGroup;
    items_check: any[] = [];
    items: any;
    service_remark: string;
    service_input: boolean;
    activeBtn: any;
    num: any;

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
            search: ['', [Validators.required]],
        });
    }

    submit() {
        localStorage.setItem('services', JSON.stringify(this.items_check));
        this._bottomSheet.open(MapComponent);
    }

    clear() {
        this.dataForm.patchValue({
            search: '',
        });
        this.items = [];
        this._changeDetectorRef.markForCheck();
    }

    selectPoint(index){

        localStorage.setItem('mylocation', JSON.stringify(this.items[index]));

        this._router.navigate(['screens/services/step-two-map']);
    }

    onChange(event: any) {
        console.log(event.target.value);

        const data = {
            search: event.target.value,
        };

        this._service.get_loations(data).subscribe((resp: any) => {
            try {
                this.items = resp.data;
                this._changeDetectorRef.markForCheck();
            } catch (error) {
                console.log(error);
            }
        });

        this._changeDetectorRef.markForCheck();
    }
}
