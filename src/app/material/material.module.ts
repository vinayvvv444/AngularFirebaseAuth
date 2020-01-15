import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material";
import {MatCardModule} from '@angular/material/card';

const MaterialComponents = [
  MatButtonModule,
  MatCardModule
];


@NgModule({
 
  imports: [MaterialComponents],
  exports:[MaterialComponents]
})
export class MaterialModule { }
