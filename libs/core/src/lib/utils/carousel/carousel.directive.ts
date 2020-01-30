import { AfterContentInit, Directive, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[fd-carousel]',
    host: {
        'class': 'fd-carousel'
    }
})
export class CarouselDirective implements AfterContentInit, OnChanges {

    actualTranslate: number = 0;
    private firstVisibleIndex: number;

    private lastVisibleIndex: number;

    @Input()
    parentElement: ElementRef;

    @HostBinding('style.transform')
    transform;

    @Input()
    enable: boolean = false;

    @Input()
    elements: ElementRef[];

    @Input()
    elementsPerSlide: number;

    @Output()
    readonly showBackArrow: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    readonly showNextArrow: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor (
        private _elementRef: ElementRef
    ) {}

    refresh(): void {
        this.firstVisibleIndex = 0;
    }

    public ngAfterContentInit(): void {
        this.refresh();
    }

    public goToNextElement(): void {
        this.goToNextElements(this.elementsPerSlide);
    }

    public goToPreviousElement(): void {
        this.goToPreviousElements(this.elementsPerSlide);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.enable && this.elements && this.parentElement) {
            this.paddingsOfParentElement();
            this.lastVisibleIndex = this.getLastVisibleElementIndex();
        }
    }

    private getLastVisibleElementIndex(): number {
        let tempWidthOfElements: number = 0;

        for (let index = this.firstVisibleIndex; index < this.elements.length - 1; index ++) {
            tempWidthOfElements = tempWidthOfElements + this.getElementWidth(this.elements[index]);
            if (tempWidthOfElements >= this.getParentElementWidth()) {
                return index;
            }
        }

        return this.elements.length - 1;
    }

    private getFirstVisibleElementIndex(): number {
        let tempWidthOfElements: number = 0;

        for (let index = this.lastVisibleIndex; index > 0; index --) {
            tempWidthOfElements = tempWidthOfElements + this.getElementWidth(this.elements[index]);
            if (tempWidthOfElements >= this.getParentElementWidth()) {
                return index;
            }
        }

        return 0;
    }

    private goToNextElements(count: number): void {
        if (this.willNextElementsComeToTheEnd(count)) {
            this.lastVisibleIndex = this.elements.length - 1;
            this.firstVisibleIndex = this.getFirstVisibleElementIndex();
            this.scrollToEnd();
        } else {
            this.scrollBy(count);
            this.firstVisibleIndex = this.firstVisibleIndex + count;
            this.lastVisibleIndex = this.getLastVisibleElementIndex();
        }
        console.log('first', this.firstVisibleIndex);
        console.log('last', this.lastVisibleIndex);
    }

    private goToPreviousElements(count): void {
        if (this.willNextElementsComeToTheStart(count)) {
            this.firstVisibleIndex = 0;
            this.lastVisibleIndex = this.getLastVisibleElementIndex();
            this.scrollToStart();
        } else {
            this.scrollBackBy(count);
            this.firstVisibleIndex = this.firstVisibleIndex - count;
            this.lastVisibleIndex = this.getLastVisibleElementIndex();
        }
        console.log('first', this.firstVisibleIndex);
        console.log('last', this.lastVisibleIndex);
    }

    private scrollBy(count: number): void {
        this.refreshTransform(this.actualTranslate + this.getWidthOfNextElements(count));
    }

    private scrollBackBy(count: number): void {
        this.refreshTransform(this.actualTranslate - this.getWidthOfPreviousElements(count));
    }

    private getElementWidth(elementRef: ElementRef): number {
        const marginRight = this.getPxPropertyOfElement(elementRef, 'margin-right');
        const marginLeft = this.getPxPropertyOfElement(elementRef, 'margin-left');
        if (elementRef && elementRef.nativeElement) {
            return elementRef.nativeElement.offsetWidth + marginLeft + marginRight;
        } else {
            return 0;
        }
    }

    private getWidthOfNextElements(count: number): number {
        let tempWidthOfElements: number = 0;

        for (let index = this.lastVisibleIndex; index < this.elements.length - 1 && count > 0; index ++) {
            tempWidthOfElements = tempWidthOfElements + this.getElementWidth(this.elements[index]);
            count--;
        }

        return tempWidthOfElements;
    }

    private getWidthOfPreviousElements(count: number): number {
        let tempWidthOfElements: number = 0;

        for (let index = this.firstVisibleIndex; index > 0 && count > 0; index --) {
            tempWidthOfElements = tempWidthOfElements + this.getElementWidth(this.elements[index]);
            count--;
        }

        return tempWidthOfElements;
    }

    private getParentElementWidth(): number {
        return this.getElementWidth(this.parentElement) - this.paddingsOfParentElement();
    }

    private paddingsOfParentElement(): number {
        const paddingLeft = this.getPxPropertyOfElement(this.parentElement, 'padding-left');
        const paddingRight = this.getPxPropertyOfElement(this.parentElement, 'padding-right');

        // tslint:disable-next-line:radix
        return paddingRight + paddingLeft;
    }

    private willNextElementsComeToTheEnd(count: number): boolean {
        return (this.lastVisibleIndex + count) >= this.elements.length - 1;
    }

    private willNextElementsComeToTheStart(count: number): boolean {
        return (this.firstVisibleIndex - count) <= 0;
    }

    private scrollToEnd(): void {
        const widths: number[] = this.elements.map(element => this.getElementWidth(element));
        const allElementsWidth: number = widths.reduce((total: number, elementWidth: number) => total + elementWidth);
        this.refreshTransform( allElementsWidth - this.getParentElementWidth());
    }

    private scrollToStart(): void {
        this.refreshTransform(0);
    }

    private refreshTransform(transformXPx: number): void {
        this.actualTranslate = transformXPx;
        this.transform = 'translate(-' + this.actualTranslate + 'px)';
        console.log(this.transform);
    }

    private getPxPropertyOfElement(element: ElementRef, property: string): number {
        const _property: string = window.getComputedStyle(element.nativeElement, null).getPropertyValue(property);
        // tslint:disable-next-line:radix
        return parseInt(_property);
    }
}
