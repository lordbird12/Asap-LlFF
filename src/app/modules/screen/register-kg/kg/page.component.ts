import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
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
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { getCookie, setCookie } from 'typescript-cookie'

@Component({
    selector: 'register-kg',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class KgComponent implements OnInit {
    dataForm: UntypedFormGroup;
    disableBtn: boolean = true;
    item: any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
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
        // Create the form
        this.dataForm = this._formBuilder.group({
            mlie: [
                null,
                [Validators.required, Validators.pattern('[0-9 ]{11}')],
            ],
        });

         this.item = getCookie('data')
            ? JSON.parse(getCookie('data')).data
            : [];

            console.log(this.item);
            this._changeDetectorRef.markForCheck();
        // this._service.getById(json.license).subscribe((resp: any) => {
        //     this.item = resp.data;
        //     this._changeDetectorRef.markForCheck();
        // });
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
