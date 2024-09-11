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
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { MatSnackBar } from '@angular/material/snack-bar'; // Add this line

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
// import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker'; // Add NgswCommChannel to the import statement
import { cilInfo, cilWarning } from '@coreui/icons';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { filter } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [HttpClient, SocketService],
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
            CommonModule],
})

export class DashboardComponent implements OnInit{
  
  title = 'hydrosense';
  
  icons = { cilWarning, cilInfo };
  
  public niveis = [];
  public vazoes = [];

  data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        label: 'Vazão',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: this.vazoes
      },
      {
        label: 'Nível',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: this.niveis
      }
    ]
  };
  public buttonFlag: boolean = true;
  
  constructor(private socketService: SocketService) {
  }
  ngOnInit(): void {
    // this.buttonFlagLogic();
    this.socketService.onMessage().subscribe((message) => {
      console.log(message);
      console.log('Mensagem recebida no componente:', message);
      
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

    console.log(this.buttonFlag);
    console.log(this.niveis[this.niveis.length -1]);
    console.log(this.vazoes[this.vazoes.length - 1]);
  }

}
