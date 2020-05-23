import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators } from './shared/custom.validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'poc-reactive-form';

  employeeForm: FormGroup;
  // All form validation messages object.
  validationMessages = {
    'fullName': {
      'required': 'Full name is required.',
      'minlength': 'Full name must be greater than 2 char.',
      'maxlength': 'Full name must be less than 10 char.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domian should be dell.com'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    'skillName': {
      'required': 'Skills name is required.'
    },
    'experienceInYear': {
      'required': 'Experience is required.'
    },
    'proficiency': {
      'required': 'Proficiency is required.'
    },
  }
  // All failed validation messages to be store and 
  // Binde this object to the UI for showing error.
  formErrors = {
    'fullName': '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYear': '',
    'proficiency': ''
  }

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this._formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
      phone: ['', Validators.required],
      skills: this._formBuilder.group({
        skillName: ['', Validators.required],
        experienceInYear: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    })
    // Calling vaildation on every value changes filed.
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationError(this.employeeForm);
    })
  }

  // Logging validation error.
  logValidationError(group: FormGroup = this.employeeForm): void {
    // Looping over each from control keys
    Object.keys(group.controls).forEach((key: string) => {
      // Getting form control
      const abstractControl = group.get(key);
      // Checking form control type
      if (abstractControl instanceof FormGroup) {
        // Recursivly calling again logValidationError method
        this.logValidationError(abstractControl)
      } else {
        // Initialized form error object empty
        this.formErrors[key] = '';
        // Checking form control is valid or not
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          // Getthing respectiv message from validation message object
          const messages = this.validationMessages[key];
          
          for (let errorKey in abstractControl.errors) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
    })
  }

  onSelectionChange(data) {
    let selectedValue = data.value;
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  onLoadDataClick(): void {
    // this.logValidationError(this.employeeForm);
  }

  onSubmit(): void {
    console.log(this.employeeForm.value)
  }
}
