import {
    AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter, forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { TabPanelComponent } from './tab/tab-panel.component';
import { Subscription } from 'rxjs';
import { TabsService } from './tabs.service';
import { MenuKeyboardService } from '../menu/menu-keyboard.service';
import { MenuItemDirective } from '../menu/menu-item.directive';

export type TabModes = 'icon-only' | 'process' | 'filter'

export type TabSizes = 's' | 'm' | 'l' | 'xl' | 'xxl';

/**
 * Represents a list of tab-panels.
 */
@Component({
    selector: 'fd-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrls: ['./tab-list.component.scss'],
    host: {
        class: 'fd-tabs-custom'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TabsService, MenuKeyboardService]
})
export class TabListComponent implements AfterContentInit, OnChanges, OnDestroy {

    panelTabsHiddenArray: TabPanelComponent[] = [];

    /** @hidden */
    @ContentChildren(TabPanelComponent)
    panelTabs: QueryList<TabPanelComponent>;

    /** @hidden */
    @ViewChildren('tabLink')
    tabLinks: QueryList<ElementRef>;

    /** @hidden */
    @ViewChildren(forwardRef(() => MenuItemDirective))
    menuItems: QueryList<MenuItemDirective>;

    // /** @hidden */
    // @ViewChildren(TabItemDirective)
    // tabItems: QueryList<TabItemDirective>;

    // /** @hidden */
    // @ViewChild('tabList', { static: false })
    // tabList: ElementRef;

    /** Index of the selected tab panel. */
    @Input()
    selectedIndex: number = 0;

    /** Whether user wants to use tab component in compact mode */
    @Input()
    compact: boolean = false;

    /** Size of tab, it's mostly about adding spacing on tab container, available sizes 's' | 'm' | 'l' | 'xl' | 'xxl' */
    @Input()
    size: TabSizes = 'm';

    /**
     * Whether user wants to use tab component in certain mode. Modes available:
     * 'icon-only' | 'process' | 'filter'
     */
    @Input()
    mode: TabModes;

    /**
     * Whether user wants to keep tabs on overflow popup. It can be handy, when there is too much tabs.
     */
    @Input()
    fillOverflow: boolean = false;

    /** Event emitted when the selected panel changes. */
    @Output()
    selectedIndexChange = new EventEmitter<number>();

    private _tabsSubscription: Subscription;
    private _tabSelectSubscription: Subscription;

    constructor(
        private tabsService: TabsService,
        private _changeRef: ChangeDetectorRef,
        private _menuService: MenuKeyboardService
    ) {}

    /** @hidden */
    ngAfterContentInit(): void {
        setTimeout(() => {
            this.selectTab(this.selectedIndex);
        });

        this._tabSelectSubscription = this.tabsService.tabSelected.subscribe(index => {
            if (index !== this.selectedIndex) {
                this.selectTab(index);
            }
        });

        this._tabsSubscription = this.panelTabs.changes.subscribe(() => {
            this._changeRef.detectChanges();
            // if (this.areTwoRows()) {
            //     this.hideLastElement();
            // } else {
            //     this.showFirstElement();
            // }
            if (!this.isIndexInRange() || this.isTabContentEmpty()) {
                this.resetTabHook();
            }
        });
    }

    /** @hidden */
    ngOnDestroy(): void {
        this._tabsSubscription.unsubscribe();
        this._tabSelectSubscription.unsubscribe();
    }

    /** @hidden */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedIndex) {
            setTimeout(() => {
                this.selectTab(changes.selectedIndex.currentValue);
            });
        }
    }

    /**
     * Function to select a new tab from an index.
     * @param tabIndex Index of the tab to select.
     */
    selectTab(tabIndex: number): void {
       if (this.isIndexInRange()) {
            this.panelTabs.forEach((tab, index) => {
                tab.expanded = index === tabIndex;
            });
            this.selectedIndex = tabIndex;
            this._changeRef.detectChanges();
            this.selectedIndexChange.emit(tabIndex);
        }
    }

    /** @hidden */
    tabHeaderClickHandler(tabIndex: number): void {
        if (this.selectedIndex !== tabIndex) {
            this.selectTab(tabIndex);
        }
    }

    /** @hidden */
    tabHeaderKeyHandler(index: number, event: any): void {
        this.tabsService.tabHeaderKeyHandler(index, event, this.tabLinks.map(tab => tab.nativeElement));
    }

    /** Overflow popup menu keyboard support */
    public handleKeyDown(event: KeyboardEvent, index: number): void {
        this._menuService.keyDownHandler(event, index, this.menuItems.toArray());
    }

    // private areTwoRows(): boolean {
    //     return this.tabList.nativeElement.offsetHeight > 1.5 * this.tabItems.first.elementRef().nativeElement.offsetHeight;
    // }
    //
    // private hideLastElement(): void {
    //     const onlyShownElements: TabItemDirective[] = this.tabItems.toArray()
    //     .filter(tab => !tab.elementRef().nativeElement.style.display.includes('none'));
    //     const lastElement = onlyShownElements[onlyShownElements.length - 1];
    //     lastElement.elementRef().nativeElement.style.display = 'none';
    //     const indexOfElement: number = this.tabItems.toArray().indexOf(lastElement);
    //     if (indexOfElement !== -1) {
    //         this.addElementToArray(this.panelTabs.toArray()[indexOfElement]);
    //     }
    // }
    //
    // private showFirstElement(): void {
    //     const element = this.panelTabsHiddenArray.pop();
    //     if (element) {
    //         const index: number = this.panelTabs.toArray().indexOf(element);
    //         console.log(index);
    //         if (this.tabItems.toArray()[index]) {
    //             this.tabItems.toArray()[index].elementRef().nativeElement.style.display = '';
    //         }
    //     }
    // }

    // private addElementToArray(element: TabPanelComponent): void {
    //     console.log(element);
    //     this.panelTabsHiddenArray.push(element);
    // }

    private isIndexInRange(): boolean {
        return this.panelTabs && this.panelTabs.length > 0 && this.selectedIndex < this.panelTabs.length;
    }

    private isTabContentEmpty(): boolean {
        let result = true;
        this.panelTabs.forEach(tab => {
            if (tab.expanded) {
                result = false;
            }
        });
        return result;
    }

    private resetTabHook(): void {
        this.selectedIndex = 0;
        setTimeout(() => {
            this.selectTab(this.selectedIndex);
        });
    }
}
