import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'rtl-toggle',
    template: `
        <fd-toggle [(ngModel)]="isChecked" (ngModelChange)="onChange()">
           <label fd-form-label>
                Simulate RTL
            </label>
        </fd-toggle>
    `,
    encapsulation: ViewEncapsulation.None
})
export class DirectionalityComponent implements OnInit {
    id: string;
    isChecked: boolean = false;
    @Input()
    label: string;

    @Input()
    element: string;

    @Input()
    className: string;

    ngOnInit() {
        if (this.label) {
            this.id = this.label + Date.now() + '-rtl';
        } else {
            this.id = Date.now() + 6 + '';
        }
    }

    onChange() {
        const dirValue = this.isChecked ? 'rtl' : 'ltr';
        if (this.className) {
            Array.from(document.getElementsByClassName(this.className)).forEach(
                (element: HTMLElement) => (element.dir = dirValue)
            );
        }
        if (this.element) {
            Array.from(document.getElementsByTagName(this.element)).forEach(
                (element: HTMLElement) => (element.dir = dirValue)
            );
        }
        if (this.label) {
            document.getElementById(this.label).dir = dirValue;
        }
    }
}
