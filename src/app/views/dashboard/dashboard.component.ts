import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, NgModule, OnChanges, OnInit, Renderer2, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartOptions, scales } from 'chart.js';
import {
  AccordionModule,
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  AccordionComponent,
  AccordionItemComponent,
  TemplateIdDirective,
  AccordionButtonDirective,
  FormModule,
  ToastModule,
  ModalModule
} from '@coreui/angular';
import { ChartjsComponent, ChartjsModule } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { cilInfo, cilWarning } from '@coreui/icons';
import { HttpClient, HttpClientModule, HttpHandler, HttpHeaders } from '@angular/common/http';

import { WebSocketService } from 'src/app/services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessagingService } from 'src/app/services/messaging.service';
import {TokenService} from 'src/app/services/token.service';


import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "../../../environments/environment";
import { initializeApp } from "firebase/app";
initializeApp(environment.firebase);

import emailjs from '@emailjs/browser'; // Import emailjs library
import { delay } from 'rxjs';

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [HttpClient, WebSocketService, MessagingService, TokenService],
  styleUrls: ['dashboard.component.scss'],
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
            HttpClientModule,
            AccordionModule,
            AccordionComponent,
            AccordionItemComponent,
            TemplateIdDirective,
            FormModule,
            ToastModule,
            ModalModule
          ],
})

export class DashboardComponent implements OnInit{
  
  title = 'hydrosense';
  
  icons = { cilWarning, cilInfo };
  
  public niveis: number[] = [];
  public vazoes: number[] = [];
  public geral: any[] = [];
  
  public buttonFlag: boolean = false;
  public message: any = null;
  public currentToken: string = "";
  public accessToken: string = "";
  public notificationSent: boolean = false;
  public emailSent: boolean = false;
  public checkInterval: any = null;
  public notificationSeen: boolean = false;
  public modalNotificationSeen: boolean = false;
  public flagToastFormFailed: boolean = false;
  public submittedContactForm: boolean = false;
  
  public notificationSentCount: number = 0;
  public notificationInterval: any = null;
  public dangerZone: boolean = false;

  public flagToastFormSuccess: boolean = false;
  

  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Nível',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: this.niveis
      },
      {
        label: 'Vazão',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: this.vazoes
      }
    ]
  };

  chartOptions = {
    scales: {
      y: 
        {
            beginAtZero: true
          }
        }
  };

  public contactForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
  });
  

  
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private webSocketService: WebSocketService,
              private messagingService: MessagingService,
              private tokenService: TokenService,
              private formBuilder: FormBuilder,
              ) {
  }
  ngOnInit(): void {
    this.webSocketService.message$.subscribe((message: string) => {
      message = JSON.parse(message);
      this.geral.push(message);
      this.niveis.push(this.geral[this.geral.length - 1].nivel);
      this.vazoes.push(this.geral[this.geral.length - 1].vazao);  
      if(this.vazoes[this.vazoes.length -1] > 50 || this.niveis[this.niveis.length -1] > 50){
        this.notificationSeen = false;
        this.dangerZone = false;
      }else if(this.vazoes[this.vazoes.length -1] <= 50 && this.niveis[this.niveis.length -1] <= 50){
        this.dangerZone = true;
      }
      this.resetArrays();
      this.changeDetectorRef.detectChanges();
      this.sendOnlyOneMessage(this.vazoes[this.vazoes.length -1], this.niveis[this.niveis.length -1]);
      this.sendEmail();
    });
    this.requestPermission();
    this.listen();
    this.getAccessToken();
  }
  
  
  public resetArrays() {
    if (this.niveis.length > 10) {
      this.niveis.shift();
    }
    if (this.vazoes.length > 10) {
      this.vazoes.shift();
    }
  }

  public goToContactPage(){
    window.location.href = 'http://localhost:4200/#/contact';
  }

  requestPermission() {

    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
      if (currentToken) {
        console.log("Token")
        console.log(currentToken);
        this.currentToken = currentToken; 
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });

  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }

  public sendMessage() {
    this.messagingService.sendNotification(this.currentToken, this.accessToken).subscribe((response) => {
      console.log(response);
    }
    );       
  }


  
  public getAccessToken() {
    this.tokenService.getAccessToken().subscribe(
      (data) => {
        this.accessToken = data.accessToken;
        console.log('Access Token:', this.accessToken);
      },
      (error) => {
        console.error('Error fetching access token:', error);
      }
    );
  }

  public sendOnlyOneMessage(vazao: number, nivel:number) {
    if(this.notificationSeen == false){
      if(this.niveis[this.niveis.length -1] <= 50 && this.vazoes[this.vazoes.length -1] <= 50 && this.notificationSentCount == 0){
        this.sendMessage();
        this.notificationSentCount++;
        
        this.notificationInterval = setInterval(() => {
          if (this.notificationSentCount < 3) {
            this.sendMessage();
            this.notificationSentCount++;
          } else {
            clearInterval(this.notificationInterval);  
            this.notificationSentCount = 0;
          }
        }, 5000);
      }else if(this.niveis[this.niveis.length -1] > 50 && this.vazoes[this.vazoes.length -1] > 50){
          clearInterval(this.notificationInterval);
          this.notificationSentCount = 0;   
          this.notificationSeen = false;
      }
    }else if(this.notificationSeen == true && this.niveis[this.niveis.length -1] > 50 && this.vazoes[this.vazoes.length -1] > 50){
      clearInterval(this.notificationInterval);
      this.notificationSentCount = 0;
      this.notificationSeen = false;
    }
  }

  public sendEmail(){
    if(this.niveis[this.niveis.length -1] <= 50 && this.vazoes[this.vazoes.length -1] <= 50){
      if(this.submittedContactForm){
        if(this.contactForm.valid){
          if(!this.emailSent){
            console.log('Email enviado')
              emailjs.init('EujzZ_EZR3z2beNlL')
              emailjs.send("service_9gc89hw","template_dybhgm2",{
                from_name: this.contactForm.value.name,
                from_email: this.contactForm.value.email,
                from_service: "Abastecimento Urgente",
                address: this.contactForm.value.address,
                message: this.contactForm.value.phone
                });
              this.emailSent = true;
          }else{
            console.log('Email já enviado');
          }
        }
      }
    }else{
      console.log('Nível e Vazão estão normais')
      this.emailSent = false;
    }
  }

  public saveData(){
    if(this.contactForm.valid){
      console.log('Dados salvos')
      this.submittedContactForm = true;
      this.flagToastFormSuccess = true;
			setTimeout(() => {
				this.flagToastFormSuccess = false;
			}, 5000);
    }else{
      console.log('Formulário inválido')
      this.flagToastFormFailed = true;
      setTimeout(() => {
        this.flagToastFormFailed = false;
      }, 5000);
    }
  }

  public setNotificationSeen(){
    this.notificationSeen = true;
    this.modalNotificationSeen = true;
    setTimeout(() => {
      this.modalNotificationSeen = false;
    },3000);
  }

}
