import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckinComponent } from '@modules/checkin';

describe('CheckinComponent', () => {
    let component: CheckinComponent;
    let fixture: ComponentFixture<CheckinComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CheckinComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckinComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
