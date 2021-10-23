/* eslint-disable angular/timeout-service */
import { ListKeyManager } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AirportService } from '@shared/components/airport/airport.service';
import { ListItemComponent } from '@shared/components/list-item/list-item.component';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'airport-autocomplete',
    templateUrl: './airport-autocomplete.component.html',
    styleUrls: ['./airport-autocomplete.component.scss']
})

/**
 * This is a reusable component for displaying a list of airports when the
 * user enters at least 3 characters on the airport fields.
 */
export class AirportAutocompleteComponent implements AfterViewInit {

    /**
     * Output Event to emit the code value of the selected Airport.
     */
    @Output() selectAirport: EventEmitter<string>;

    /**
     * This is a view reference to the list of airports search results displayed.
     */
    @ViewChildren(ListItemComponent) airportList: QueryList<ListItemComponent>;

    /**
     * This is a reference to the container which wraps the airports list
     * and makes it possible to set different styles to this container.
     */
    @ViewChild('searchResult', { read: ElementRef }) searchResult: ElementRef;
    /**
     * This array holds the airport search results used to populate the QueryList.
     */
    airportDataList: Array<any>;
    /**
     * This manages the keyboard events and works with the airport QueryList to navigate
     * the list with the up/down keyboard arrow and set the active item accordingly.
     */
    private keyboardEventManager: ListKeyManager<any>;

    /**
     * Keeps track on if the field the autocomplete is attached to is in focus.
     */
    isFieldFocused: boolean;

    constructor(private airportService: AirportService,
                private logger: NGXLogger) {
        this.selectAirport = new EventEmitter<string>();
    }

    ngAfterViewInit(): void {
        this.keyboardEventManager = new ListKeyManager<any>(this.airportList);
        this.initKeyManagerHandlers();
    }

    /**
     *
     * @param airport
     */
    selectItem(airport) {
        this.logger.debug('selected airport is:', airport);
        this.selectAirport.emit(airport.code);
        this.airportDataList = [];
    }

    formatAirportName(item): string {
        const stateCode = item.stateCode != null && item.stateCode != '' ? item.stateCode : item.countryName;
        const airportName = item.code + ' - ' + item.name + ', ' + stateCode;
        return airportName;
    }

    /**
     * Handler to handle the UP and DOWN arrow keyboard events
     * and highlights the selected item from the airport list.
     */
    initKeyManagerHandlers() {
        this.keyboardEventManager.change.subscribe((activeIndex) => {
            this.airportList.map((item, index) => {
                item.setActive(activeIndex === index);
                return item;
            });
        });
    }

    /**
     * @param event fired when any key is pressed on the keyboard
     * This function listens to the UP and DOWN arrow key events
     * and sends it to the keyboardEventManager.
     */
    handleKeydown(event: KeyboardEvent) {
        event.stopImmediatePropagation();
        if(this.keyboardEventManager) {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown': {
                    this.keyboardEventManager.onKeydown(event);
                    break;
                }
                case 'Enter': {
                    if (this.keyboardEventManager.activeItem !== null) {
                        this.keyboardEventManager.activeItem.onItemSelect();
                    }
                    break;
                }
                case 'Escape':
                case 'Tab': {
                    this.airportDataList = [];
                    break;
                }
                case 'ArrowLeft':
                case 'ArrowRight': {
                    break;
                }
                default: {
                    this.searchAirports(event);
                    break;
                }
            }
        }
    }

    onFocusOut(event) {
        this.airportDataList = [];
        this.isFieldFocused = false;
        this.keyboardEventManager.setActiveItem(-1);
    }

    onFocusIn() {
        this.isFieldFocused = true;
    }

    /**
     * @param event triggered once the user starts typing some characters
     * in the airport field. Will use AirportService to query and return
     * airport results based on the search text.
     */
    searchAirports(event) {
        const searchText = event.target.value;
        if (searchText.length >= 3) {
            this.airportDataList = [];
            this.airportService.searchAirports(searchText).subscribe(rs => {
                setTimeout(() => {
                    if (this.searchResult && this.searchResult.nativeElement) {
                        const searchResultHTMLElement: HTMLElement = this.searchResult.nativeElement;
                        searchResultHTMLElement.style.backgroundColor = '#fff';
                    }
                });

                for (const element of rs) {
                    /**
                     *  Compares the current element's airport code to the airport codes in the airportDataList array,
                     *  if any of the airports have the same code, the element will not be pushed
                     * */
                    if (!this.airportDataList.some(e => e.code === element.code)) {
                        this.airportDataList.push(element);
                    }
                }

                if (this.keyboardEventManager) {
                    this.keyboardEventManager.setActiveItem(-1);
                }
            });
        } else {
            this.airportDataList = [];
        }
    }
}
