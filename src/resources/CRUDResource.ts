/**
 *  @internal
 *  @module Resources
 */
import { RestAPI, HTTPMethod } from '../api/RestAPI';
import { Resource, DefinedRoute } from './Resource';

export enum CursorDirection {
    ASC = 'asc',
    DESC = 'desc',
}

/* Request */
export interface CRUDPaginationParams {
    limit?: number;
    cursor?: string;
    cursorDirection?: CursorDirection;
}

/* Response */
export interface CRUDItemsResponse<A> {
    items: A[];
    hasMore: boolean;
}

interface CRUDResourceStatic extends Function {
    routeBase: string;
}

export abstract class CRUDResource extends Resource {
    protected _routeBase: string;

    constructor(api: RestAPI) {
        super(api);
        this._routeBase = (this.constructor as CRUDResourceStatic).routeBase;
    }

    protected _listRoute(required?: string[]): DefinedRoute {
        return this.defineRoute(HTTPMethod.GET, this._routeBase, required);
    }

    protected _createRoute(required?: string[]): DefinedRoute {
        return this.defineRoute(HTTPMethod.POST, this._routeBase, required);
    }

    protected _getRoute(required?: string[]): DefinedRoute {
        return this.defineRoute(HTTPMethod.GET, `${this._routeBase}/:id`, required);
    }

    protected _updateRoute(required?: string[]): DefinedRoute {
        return this.defineRoute(HTTPMethod.PATCH, `${this._routeBase}/:id`, required);
    }

    protected _deleteRoute(required?: string[]): DefinedRoute {
        return this.defineRoute(HTTPMethod.DELETE, `${this._routeBase}/:id`, required);
    }
}
