import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselDirective } from './carousel.directive';

@NgModule({
    imports: [CommonModule],
    exports: [
        CarouselDirective
    ],
    declarations: [
        CarouselDirective
    ]
})
export class CarouselModule {}
