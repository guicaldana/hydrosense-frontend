import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, NgModule, OnChanges, OnInit, Renderer2, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
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
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent, ChartjsModule } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { cilInfo, cilWarning } from '@coreui/icons';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { WebSocketService } from 'src/app/services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';

import { environment } from '../../../environments/environment'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [HttpClient, WebSocketService, ],
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
          ],
})

export class DashboardComponent implements OnInit{
  
  title = 'hydrosense';
  
  icons = { cilWarning, cilInfo };
  
  public niveis: number[] = [];
  public vazoes: number[] = [];
  public geral: any[] = [];

  public buttonFlag: boolean = false;
  public message: string = '';
  public receivedMessages: string[] = [];
  
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private webSocketService: WebSocketService
  ) {
  }
  ngOnInit(): void {
    // this.buttonFlagLogic();
    this.webSocketService.message$.subscribe((message: string) => {
      message = JSON.parse(message);
      this.geral.push(message);
      this.niveis.push(this.geral[this.geral.length - 1].nivel);
      this.vazoes.push(this.geral[this.geral.length - 1].vazao);  
      this.resetArrays();
      this.changeDetectorRef.detectChanges();
      this.buttonFlagLogic();
    });
    // this.socketService.sendMessage('Hello from Angular');
  }
  
  
  public resetArrays() {
    if (this.niveis.length > 10) {
      this.niveis.shift();
    }
    if (this.vazoes.length > 10) {
      this.vazoes.shift();
    }
  }

  public addData() {
    // preciso do servidor aaaaaa
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

}
