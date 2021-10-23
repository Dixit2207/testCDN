import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { FlightStatusComponent } from '@modules/flight-status';
import { I18N_PROVIDERS } from '@modules/translations.module';
import { I18NextModule, I18NextPipe } from 'angular-i18next';

describe('FlightStatusComponent', () => {
    let component: FlightStatusComponent;
    let fixture: ComponentFixture<FlightStatusComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                I18NextModule.forRoot()
            ],
            providers: [I18N_PROVIDERS, I18NextPipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [FlightStatusComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlightStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
