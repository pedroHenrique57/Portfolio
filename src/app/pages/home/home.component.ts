import {Component, HostListener} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import emailjs, {type EmailJSResponseStatus} from '@emailjs/browser';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isNameInputFocusStyle: boolean = false;
  isEmailInputFocusStyle: boolean = false;
  isTextareaInputFocusStyle: boolean = false;
  emailFormToRecord!: Record<string, string>;
  emailForm: FormGroup;
  pagesSections: string[] = ['aboutMe', 'description', 'myHistory', 'whatIDo', 'contactMe'];
  pageSectionsIndexCount: number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required, Validators.minLength(15)]),
    });
  }

  sendEmail(event: Event) {
    if (this.emailForm.valid) {
      this.emailFormToRecord = {
        name: this.emailForm.value.name,
        email: this.emailForm.value.email,
        message: this.emailForm.value.message
      };

      event.preventDefault();
      emailjs
        .send('Port', 'Port Template', this.emailFormToRecord, {
          publicKey: 'UFXabJfHrWlHmvomG',
        })
        .then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', (error as EmailJSResponseStatus).text);
          },
        );
    } else {
      event.preventDefault();
      document.forms[0].reportValidity();
    }
  }

  @HostListener('wheel', ['$event'])
  rollWheel(event: WheelEvent) {
    event.preventDefault();
    const deltaYSign = Math.sign(event.deltaY);
    const maxSectionsIndex = this.pagesSections.length - 1;

    let newIndex = this.pageSectionsIndexCount + deltaYSign;
    newIndex = Math.max(0, Math.min(maxSectionsIndex, newIndex));

    const targetSectionId = this.pagesSections[newIndex];
    const targetElement = document.getElementById(targetSectionId);

    targetElement?.scrollIntoView({behavior: 'smooth'});
    this.pageSectionsIndexCount = newIndex;
  }
}
