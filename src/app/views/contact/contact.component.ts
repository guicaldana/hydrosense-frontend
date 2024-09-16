import { NgStyle, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ButtonGroupComponent, FormCheckLabelDirective, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, AvatarComponent, ModalComponent, ModalModule, FormModule } from '@coreui/angular';
import { ChartjsComponent, ChartjsModule } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import emailjs from '@emailjs/browser'; // Import emailjs library

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [WidgetsDropdownComponent, 
            TextColorDirective, 
            CardComponent, 
            CardBodyComponent, 
            RowComponent, 
            ColComponent, 
            ButtonDirective, 
            IconDirective, 
            ReactiveFormsModule, 
            ButtonGroupComponent, 
            FormCheckLabelDirective, 
            ChartjsComponent, 
            NgStyle, 
            CardFooterComponent, 
            GutterDirective, 
            ProgressBarDirective, 
            ProgressComponent, 
            WidgetsBrandComponent, 
            CardHeaderComponent, 
            TableDirective, 
            AvatarComponent,
            CommonModule,
            ChartjsModule,
            ModalModule,
            FormModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  public visibleContactConcluded: boolean = false;
  public submittedContactForm: boolean = false;
  public visibleContactFailed: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  contactForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    service: ['', Validators.required],
    address: ['', Validators.required],
    message : ['']
  });

  public sendEmail(){
    if(this.contactForm.valid){
      console.log('Email enviado')
      emailjs.init('EujzZ_EZR3z2beNlL')
      emailjs.send("service_9gc89hw","template_dybhgm2",{
        from_name: this.contactForm.value.name,
        from_email: this.contactForm.value.email,
        from_service: this.contactForm.value.service,
        address: this.contactForm.value.address,
        message: this.contactForm.value.message
        });
      this.visibleContactConcluded = true;
      this.submittedContactForm = true;
      setTimeout(() => {
        this.contactForm.reset();
        this.submittedContactForm = false;
        this.visibleContactConcluded = false;
      }, 3000);
    }else{
      this.visibleContactFailed = true;
    }
  }

  public closeFailModal(){
    this.visibleContactFailed = false;
  }

  public closeSuccessModal(){
    this.visibleContactConcluded = false;
  }
}
