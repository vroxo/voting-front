import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TopicListComponent } from "./components/list-topics.component";
import { AuthGuard } from "../auth/guards/auth.guard";
import { TopicComponent } from "./components/topic.component";

const routes: Routes = [
  { path: 'topic', component: TopicListComponent, canActivate: [AuthGuard]},
  { path: 'topic/:topicId', component: TopicComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
