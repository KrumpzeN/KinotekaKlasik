import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProjectionDetailsComponent } from './components/projection-details/projection-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projections/:id', component: ProjectionDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }