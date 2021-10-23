import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@core/core.module';
import { I18NextModule } from 'angular-i18next';

import { BookingComponent } from './booking.component';

describe('BookingComponent', () => {
    let component: BookingComponent;
    let fixture: ComponentFixture<BookingComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BookingComponent],
            imports: [
                CoreModule,
                HttpClientModule,
                RouterTestingModule,
                I18NextModule.forRoot()
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
