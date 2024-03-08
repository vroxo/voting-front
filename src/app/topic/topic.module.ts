import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../auth/interceptors/token.interceptor';
import { AuthModule } from '../auth/auth.module';
import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './components/list-topics.component';
import { TopicService } from './services/topic.service';
import { TopicComponent } from './components/topic.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [TopicListComponent, TopicComponent],
  imports: [
    CommonModule,
    AuthModule,
    HttpClientModule,
    TopicRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    TopicService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  exports: [TopicListComponent, TopicComponent]
})
export class TopicModule { }
