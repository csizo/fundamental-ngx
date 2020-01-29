import { Component, forwardRef, QueryList, ViewChildren } from '@angular/core';
import { MenuItemDirective, MenuKeyboardService } from '@fundamental-ngx/core';

@Component({
  selector: 'fd-tab-overflow-example',
  templateUrl: './tab-overflow-example.component.html',
})
export class TabOverflowExampleComponent {

    selectedTab: number = 0;

    /** @hidden */
    @ViewChildren(forwardRef(() => MenuItemDirective))
    menuItems: QueryList<MenuItemDirective>;

    tabs = [
        { content: 'Content for tab 1', title: 'tab 1' },
        { content: 'Content for tab 2', title: 'tab 2' },
        { content: 'Content for tab 3', title: 'tab 3' },
        { content: 'Content for tab 4', title: 'tab 4' },
        { content: 'Content for tab 5', title: 'tab 5' }
    ];

    public handleKeyDown(event: KeyboardEvent, index: number): void {
        this._menuService.keyDownHandler(event, index, this.menuItems.toArray());
    }

    public tabClickHandler(index: number): void {
        this.selectedTab = index;
    }

    constructor(
        private _menuService: MenuKeyboardService
    ) {}

}
