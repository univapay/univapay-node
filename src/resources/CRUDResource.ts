/**
 *  @internal
 *  @module Resources
 */
import { HTTPMethod, RestAPI } from "../api/RestAPI.js";

import { DefinedRoute, DefineRouteOptions, Resource } from "./Resource.js";

export enum CursorDirection {
    ASC = "asc",
    DESC = "desc",
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

    protected _listRoute(options?: DefineRouteOptions): DefinedRoute {
        return this.defineRoute(HTTPMethod.GET, this._routeBase, options);
    }

    protected _createRoute(options?: DefineRouteOptions): DefinedRoute {
        return this.defineRoute(HTTPMethod.POST, this._routeBase, options);
    }

    protected _getRoute(options?: DefineRouteOptions): DefinedRoute {
        return this.defineRoute(HTTPMethod.GET, `${this._routeBase}/:id`, options);
    }

    protected _updateRoute(options?: DefineRouteOptions): DefinedRoute {
        return this.defineRoute(HTTPMethod.PATCH, `${this._routeBase}/:id`, options);
    }

    protected _deleteRoute(options?: DefineRouteOptions): DefinedRoute {
        return this.defineRoute(HTTPMethod.DELETE, `${this._routeBase}/:id`, options);
    }
}
