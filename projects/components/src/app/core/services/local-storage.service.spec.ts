import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@core/core.module';
import { LocalStorageService } from '@core/services/local-storage.service';

describe('LocalStorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            CoreModule
        ]
    }));

    it('should be created', () => {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);
        expect(service).toBeTruthy();
    });

    it('should return null for invalid key', function() {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);
        expect(service.get('ABC')).toBeFalsy();
    });
    it('should return string value for valid key', function() {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);
        service.set('XYZ', 'xyz-test');
        expect(service.get('XYZ')).toEqual('xyz-test');
    });
    it('should return string value for valid key', function() {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);
        const preJsonVal = JSON.stringify({ test: 'xyz-test' });
        service.set('XYZ', JSON.stringify({ test: 'xyz-test' }));
        const jsonVal = service.get('XYZ');
        expect(jsonVal).toEqual(preJsonVal);
    });
    it('should remove value for valid key', function() {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);
        service.set('ABC', 'test');
        service.remove('ABC');
        expect(service.get('ABC')).toBeFalsy();
    });
    it('should contain no values after clear is called', function() {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);
        service.set('ABC', 'test');
        service.clear();
        expect(service.get('ABC')).toBeFalsy();
    });
});
