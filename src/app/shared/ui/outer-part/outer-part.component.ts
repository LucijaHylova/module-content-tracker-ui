import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { FooterComponent } from '../../../features/footer/footer.component';
import { HeaderComponent } from '../../../features/header/header.component';

@Component({
  selector: 'app-outer-part',
  templateUrl: './outer-part.component.html',
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent
  ],
  styleUrls: ['./outer-part.component.scss']
})
export class OuterPartComponent {

}
