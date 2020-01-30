import { Component } from '@angular/core';

@Component({
  selector: 'fd-adding-tab-example',
  templateUrl: './adding-tab-example.component.html',
  styleUrls: ['./adding-tab-example.component.scss']
})
export class AddingTabExampleComponent {
    tabs = [];

    constructor() {
        for (let i  = 0; i < 30 ; i ++) {
            this.addTab();
        }
    }

    addTab(): void {
        if (this.tabs.length > 30) {
            return;
        }
        this.tabs.push({
            title: 'Tab ' + (this.tabs.length),
            content: 'Content ' + (this.tabs.length)
        });
    }

    removeTab(): void {
        if (this.tabs.length <= 1) {
            return;
        }
        this.tabs.shift();
    }
}
