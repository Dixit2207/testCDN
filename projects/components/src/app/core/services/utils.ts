import { HttpHeaders } from '@angular/common/http';
import { environment } from 'env';

export class Utils {
    static headers = new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Access-Control-Allow-Origin': environment.server,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
}
