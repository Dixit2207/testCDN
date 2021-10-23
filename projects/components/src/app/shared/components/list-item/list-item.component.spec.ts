import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemComponent } from '@shared/components/list-item/list-item.component';

describe('ListItemComponent Test', () => {
    let component: ListItemComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<ListItemComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ListItemComponent]
        });
        fixture = TestBed.createComponent(ListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });
});
