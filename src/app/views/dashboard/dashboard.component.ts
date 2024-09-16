import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, NgModule, OnChanges, OnInit, Renderer2, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
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
  AccordionButtonDirective
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
            TemplateIdDirective
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

  
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private webSocketService: WebSocketService,
              private http: HttpClient,
              private messagingService: MessagingService,
              private tokenService: TokenService
              ) {
  }
  ngOnInit(): void {
    this.webSocketService.message$.subscribe((message: string) => {
      message = JSON.parse(message);
      this.geral.push(message);
      this.niveis.push(this.geral[this.geral.length - 1].nivel);
      this.vazoes.push(this.geral[this.geral.length - 1].vazao);  
      this.resetArrays();
      this.changeDetectorRef.detectChanges();
      this.buttonFlagLogic();

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

  public buttonFlagLogic(){
    if (this.niveis[this.niveis.length -1] <= 50 && this.vazoes[this.vazoes.length -1] <= 50) {
      this.buttonFlag = true;
    }
    else {
      this.buttonFlag = false;
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

}
