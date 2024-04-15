import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, IonPopover } from '@ionic/angular/standalone';


import { Device } from '@capacitor/device';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgIf, NgFor } from '@angular/common';
import { IonRadio, IonDatetime, IonInput, IonModal, IonSelect, IonSelectOption, IonCardContent, IonLabel, IonIcon, IonList, IonRadioGroup, IonRow, IonCol, IonItem, IonToolbar, IonButton, IonButtons, IonHeader, IonGrid, IonCard, IonContent, IonAccordionGroup, IonAccordion } from "@ionic/angular/standalone";

declare function generatetoken(actionType: any, key: any): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonPopover, IonRadio, IonPopover, IonModal, IonInput, IonDatetime, IonSelect, IonSelectOption, IonCardContent, IonLabel, IonIcon, IonList, IonRadioGroup, IonRow, IonCol, IonItem, IonToolbar, IonButton, IonButtons, IonHeader, IonGrid, IonCard, IonContent, IonAccordionGroup, IonAccordion,

    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask(), LoadingController],
})
export class HomePage implements OnInit, AfterViewChecked, OnDestroy {
  errMsg: any = null;
  validation_messages: any = {
    dateOfBirth: [
      {
        type: 'required',
        message: 'date of birth',
      },
    ],
    clientId: [
      {
        type: 'required',
        message: 'client id',
      },
      {
        type: 'pattern',
        message: 'client id',
      },
    ],
  };
  linkForm: FormGroup | any;
  private deviceInfo: any;

  constructor(
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) { }

  logDeviceInfo = async () => {
    this.deviceInfo = await Device.getInfo();
  };

  ngOnInit() {
    this.errMsg = '';
    this.linkForm = this.formBuilder.group({
      dateOfBirth: ['', [Validators.required]],
      clientId: ['', [Validators.required, Validators.pattern('[0-9]+$')], ,],
      ssn: [
        '',
        [
          //Validators.required,
        ],
      ],
    });
  }

  async ionViewWillEnter() {
    await this.logDeviceInfo();
    this.errMsg = '';
    const element = document.getElementsByClassName(
      'grecaptcha-badge'
    )[0] as HTMLElement;
    if (element) {
      element.style.display = 'flex';
      element.style.top = '';
      element.style.bottom = '150px';
      element.style.position = 'fixed';
    }
    this.errMsg = '';

    this.linkForm.get('dateOfBirth').reset();
    this.linkForm.get('clientId').reset();
    this.linkForm.get('ssn').reset();
  }

  get lcf(): { [key: string]: AbstractControl } {
    return this.linkForm.controls;
  }

  dateOfBirth: any;
  hidden = true;
  dateValue: any;
  pattern = { x: { pattern: new RegExp('\\d'), symbol: 'X' } };
  unhide() {
    this.hidden = !this.hidden;
  }
  dateValueChange(dateValue: any) {
    let selectedDate;
    if (dateValue == undefined) {
      selectedDate = new Date().toISOString().split('T')[0];
    } else {
      selectedDate = dateValue?.split('T')[0];
    }

    this.dateOfBirth =
      selectedDate?.split('-')[1] +
      '/' +
      selectedDate?.split('-')[2] +
      '/' +
      selectedDate?.split('-')[0];
    this.linkForm.controls.dateOfBirth.setValue(this.dateOfBirth);
  }

  isSubmitted = false;
  async next() {
    this.errMsg = null;
    this.isSubmitted = true;

    if (!this.linkForm.valid) {
      this.errMsg =
        'Error: ' +
        'provide all fields'
      return false;
    } else {
      let reqObject: any = {
        dateOfBirth: this.linkForm?.controls?.dateOfBirth?.value,
        clientId: this.linkForm?.controls?.clientId?.value,
        ssn:
          this.linkForm?.controls?.ssn?.value === null
            ? ''
            : this.linkForm?.controls?.ssn?.value,
        languageCd: 'us',
        deviceInfo: {
          operatingSystem: this.deviceInfo?.operatingSystem,
          name: '',
          memUsed: '',
          diskFree: '',
          diskTotal: '',
          realDiskFree: '',
          realDiskTotal: '',
          model: this.deviceInfo?.model || '',
          osVersion: this.deviceInfo?.osVersion || '',
          platform: this.deviceInfo?.platform || '',
          manufacturer: this.deviceInfo?.manufacturer || '',
          isVirtual: this.deviceInfo?.isVirtual || '',
          webViewVersion: this.deviceInfo?.webViewVersion || '',
        },
        token: '',
      };
      await this.validateClientMatch(reqObject);
      return true;
    }
  }

  ngAfterViewChecked(): void {
    const element = document.getElementsByClassName(
      'grecaptcha-badge'
    )[0] as HTMLElement;
    if (element) {
      element.style.display = 'flex';
      element.style.top = '';
      element.style.bottom = '150px';
      element.style.position = 'fixed';
    }
  }

  private async validateClientMatch(reqObject: any): Promise<any> {

  }

  goBack() {
    this.linkForm.get('dateOfBirth').reset();
    this.linkForm.get('clientId').reset();
    this.linkForm.get('ssn').reset();

    const element = document.getElementsByClassName(
      'grecaptcha-badge'
    )[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
      element.ariaHidden = 'true';
    }
    const textElement = document.getElementsByClassName(
      'g-recaptcha-response'
    )[0] as HTMLElement;
    if (textElement) {
      textElement.ariaHidden = 'true';
    }

    this.router.navigateByUrl('tabs/gateway-dashboard');
  }

  ngOnDestroy() {
    const element = document.getElementsByClassName(
      'grecaptcha-badge'
    )[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
      element.ariaHidden = 'true';
    }
    const textElement = document.getElementsByClassName(
      'g-recaptcha-response'
    )[0] as HTMLElement;
    if (textElement) {
      textElement.ariaHidden = 'true';
    }
  }

  ionViewDidLeave() {
    const element = document.getElementsByClassName(
      'grecaptcha-badge'
    )[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
      element.ariaHidden = 'true';
    }
    const textElement = document.getElementsByClassName(
      'g-recaptcha-response'
    )[0] as HTMLElement;
    if (textElement) {
      textElement.ariaHidden = 'true';
    }
  }
}
