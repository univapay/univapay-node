/**
 *  @internal
 *  @module Resources
 */
import { RestAPI } from '../api/RestAPI';
import { Resource, DefinedRoute } from './Resource';
export declare enum CursorDirection {
    ASC = "asc",
    DESC = "desc"
}
export interface CRUDPaginationParams {
    limit?: number;
    cursor?: string;
    cursorDirection?: CursorDirection;
}
export interface CRUDItemsResponse<A> {
    items: A[];
    hasMore: boolean;
}
export declare abstract class CRUDResource extends Resource {
    protected _routeBase: string;
    constructor(api: RestAPI);
    protected _listRoute(required?: string[]): DefinedRoute;
    protected _createRoute(required?: string[]): DefinedRoute;
    protected _getRoute(required?: string[]): DefinedRoute;
    protected _updateRoute(required?: string[]): DefinedRoute;
    protected _deleteRoute(required?: string[]): DefinedRoute;
}
