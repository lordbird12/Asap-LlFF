import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
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
import { getCookie, setCookie } from 'typescript-cookie'

@Component({
    selector: 'register-license',
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
export class LicenseComponent implements OnInit {
    dataForm: UntypedFormGroup;
    disableBtn: boolean = true;
    licensePlate: string = '';
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.dataForm = this._formBuilder.group({
            license: [
                '',
                [Validators.required, Validators.pattern(/^([A-Z0-9]{1,7})$/)],
            ],
        });
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
        setCookie('license',JSON.stringify(obj));

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
}
