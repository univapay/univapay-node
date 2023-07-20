/**
 *  @internal
 *  @module Resources
 */
import { HTTPMethod } from "../api/RestAPI.js";

import { DefinedRoute, DefineRouteOptions, Resource } from "./Resource.js";

export enum CursorDirection {
    ASC = "asc",
    DESC = "desc",
}

/* Request */
export type CRUDPaginationParams = {
    limit?: number;
    cursor?: string;
    cursorDirection?: CursorDirection;
};

/* Response */
export type CRUDItemsResponse<A> = {
    items: A[];
    hasMore: boolean;
};

export type CRUDAOSItemsResponse<A> = CRUDItemsResponse<A> & {
    /**
     * Optional parameter indicating the total numbers of elements the list has.
     * Only present when no cursor are provided when fetching the list.
     */
    totalHits?: number;
};

export abstract class CRUDResource extends Resource {
    static routeBase: string;
    protected _routeBase: string = (this.constructor as typeof CRUDResource).routeBase;

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
