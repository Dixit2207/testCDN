import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoreModule } from '@core/core.module';
import { ManageTripsComponent } from '@modules/manage-trips';
import { I18N_PROVIDERS } from '@modules/translations.module';
import { I18NextModule, I18NextPipe } from 'angular-i18next';

describe('ManageTripsComponent', () => {
    let component: ManageTripsComponent;
    let fixture: ComponentFixture<ManageTripsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                I18NextModule.forRoot()
            ],
            providers: [I18N_PROVIDERS, I18NextPipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [ManageTripsComponent]
        }).compileComponents();
    }));

    /*    beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ManageTripsComponent]
            })
                .compileComponents();
        }));*/

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageTripsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
