import { Component } from '@angular/core';
import { Aside } from '../../components/aside/aside';

@Component({
  selector: 'app-dashboard',
  imports: [Aside],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
