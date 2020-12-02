/**
 *  @internal
 *  @module Resources
 */
import { HTTPMethod, RestAPI } from "../api/RestAPI";

import { DefinedRoute, Resource } from "./Resource";

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

    protected _listRoute(
        required?: string[],
        requireAuth?: boolean,
        acceptType?: string,
        keyFormatter?: (key: string) => string
    ): DefinedRoute {
        return this.defineRoute(HTTPMethod.GET, this._routeBase, required, requireAuth, acceptType, keyFormatter);
    }
    protected _createRoute(
        required?: string[],
        requireAuth?: boolean,
        acceptType?: string,
        keyFormatter?: (key: string) => string
    ): DefinedRoute {
        return this.defineRoute(HTTPMethod.POST, this._routeBase, required, requireAuth, acceptType, keyFormatter);
    }

    protected _getRoute(
        required?: string[],
        requireAuth?: boolean,
        acceptType?: string,
        keyFormatter?: (key: string) => string
    ): DefinedRoute {
        return this.defineRoute(
            HTTPMethod.GET,
            `${this._routeBase}/:id`,
            required,
            requireAuth,
            acceptType,
            keyFormatter
        );
    }

    protected _updateRoute(
        required?: string[],
        requireAuth?: boolean,
        acceptType?: string,
        keyFormatter?: (key: string) => string
    ): DefinedRoute {
        return this.defineRoute(
            HTTPMethod.PATCH,
            `${this._routeBase}/:id`,
            required,
            requireAuth,
            acceptType,
            keyFormatter
        );
    }

    protected _deleteRoute(
        required?: string[],
        requireAuth?: boolean,
        acceptType?: string,
        keyFormatter?: (key: string) => string
    ): DefinedRoute {
        return this.defineRoute(
            HTTPMethod.DELETE,
            `${this._routeBase}/:id`,
            required,
            requireAuth,
            acceptType,
            keyFormatter
        );
    }
}
