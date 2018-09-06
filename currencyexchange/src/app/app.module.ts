import { DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpUtilsService } from './service/http-utils.service';
import { PreviewimgService } from "./service/previewimg.service";
import { AlertService } from "./alert/alert.service";
import {HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './register/register.component';
import { ForgetpwdComponent } from './forgetpwd/forgetpwd.component';
import { SessionStorage } from './module/session.storage';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MyAdComponent } from './my-ad/my-ad.component';
import { CapitalComponent } from './capital/capital.component';
import { OrderListComponent } from './order-list/order-list.component';
import { BusinessApplyComponent } from './business-apply/business-apply.component';
import { AdvertisingComponent } from './advertising/advertising.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PreviewimgComponent } from './previewimg/previewimg.component';
import { HighAuthComponent } from './high-auth/high-auth.component';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { PaginationComponent } from './pagination/pagination.component';
import { CountDownComponent } from './count-down/count-down.component';
import { OrderDetailSellComponent } from './order-detail-sell/order-detail-sell.component';
import { AlertComponent } from './alert/alert.component';
import {LoginGuard} from "./module/login.guard";
import { NoDataComponent } from './no-data/no-data.component';
import { NoPageComponent } from './no-page/no-page.component';
import { WechatComponent } from './wechat/wechat.component';


const routeConfig: Routes = [
  {path:'', redirectTo: '/home', pathMatch: 'full' },
  {path:'home', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'forgetpwd', component: ForgetpwdComponent},
  {path:'orderDetail', component: OrderDetailComponent,canActivate: [ LoginGuard ]},
  {path:'myAd', component: MyAdComponent,canActivate: [ LoginGuard ]},
  {path:'capital', component: CapitalComponent,canActivate: [ LoginGuard ]},
  {path:'orderList', component: OrderListComponent,canActivate: [ LoginGuard ]},
  {path:'businessApply', component: BusinessApplyComponent,canActivate: [ LoginGuard ]},
  {path:'advertising', component: AdvertisingComponent,canActivate: [ LoginGuard ]},
  {path:'userinfo', component: UserinfoComponent,canActivate: [ LoginGuard ]},
  {path:'paymentMethod', component: PaymentMethodComponent,canActivate: [ LoginGuard ]},
  {path:'highAuth', component: HighAuthComponent,canActivate: [ LoginGuard ]},
  {path:'orderSell', component: OrderDetailSellComponent,canActivate: [LoginGuard]},
  {path:'**', component:NoPageComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgetpwdComponent,
    OrderDetailComponent,
    MyAdComponent,
    CapitalComponent,
    OrderListComponent,
    BusinessApplyComponent,
    AdvertisingComponent,
    UserinfoComponent,
    PaymentMethodComponent,
    PreviewimgComponent,
    HighAuthComponent,
    UploadPictureComponent,
    PaginationComponent,
    CountDownComponent,
    OrderDetailSellComponent,
    AlertComponent,
    NoDataComponent,
    NoPageComponent,
    WechatComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routeConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [SessionStorage,HttpUtilsService,PreviewimgService,AlertService,LoginGuard,DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
