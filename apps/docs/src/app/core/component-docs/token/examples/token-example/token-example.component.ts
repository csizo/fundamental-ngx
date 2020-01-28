import { Component } from '@angular/core';

@Component({
    selector: 'app-token-example',
    templateUrl: './token-example.component.html',
    styles: [
        `
            fd-token {
                margin-right: 5px;
            }
        `
    ]
})
export class TokenExampleComponent {
    isOpen = true;
}
