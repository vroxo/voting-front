import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthRootGuard } from './auth/guards/auth-root.guard';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthRootGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
