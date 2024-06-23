import { Component } from '@angular/core';

@Component({
  selector: 'app-config-message',
  templateUrl: './config-message.component.html',
  styleUrls: ['./config-message.component.scss']
})
export class ConfigMessageComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Message' }, { label: 'Message Configuration', active: true }];
  }  

}
