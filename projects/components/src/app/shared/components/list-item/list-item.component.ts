import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss']
})

export class ListItemComponent implements OnInit {

    @Input() item: any;
    @Input() display: string;
    @Output() itemSelected = new EventEmitter<any>();

    isActive: boolean;

    ngOnInit(): void {
        this.isActive = false;
    }

    setActive(value) {
        this.isActive = value;
    }

    onItemSelect() {
        this.itemSelected.emit(this.item);
    }
}
