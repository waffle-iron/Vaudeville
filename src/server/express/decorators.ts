import * as express from 'express';

export const METADATA_KEYS = {
  route: Symbol('route'),
  verb: Symbol('verb'),
};

export const ROUTES = [];

export interface IRouteMetadata {
  path: string;
  middleware: express.RequestHandler[];
  target: any;
}

export interface IVerbMetadata extends IRouteMetadata {
  verb: string;
  key: string;
}

type VerbDecorator = (target: any, key: string, value: any) => void;
type RouteDecorator = (target: any) => void;

export function route(path: string, ...middleware: express.RequestHandler[]): RouteDecorator {
  return (target: any) => {
    const metadata: IRouteMetadata = { path, middleware, target };
    Reflect.defineMetadata(METADATA_KEYS.route, metadata, target);
    ROUTES.push(target);
  };
}

export function get(path: string, ...middleware: express.RequestHandler[]): VerbDecorator {
  return verb('get', path, ...middleware);
}

function verb(verb: string, path: string, ...middleware: express.RequestHandler[]) {
  return (target: any, key: string, value: any) => {
    const metadata: IVerbMetadata = { path, middleware, verb, target, key };
    let metadataList = [];

    if (!Reflect.hasOwnMetadata(METADATA_KEYS.verb, target.constructor)) {
      Reflect.defineMetadata(METADATA_KEYS.verb, metadataList, target.constructor);
    } else {
      metadataList = Reflect.getOwnMetadata(METADATA_KEYS.verb, target.constructor);
    }

    metadataList.push(metadata);
  };
}
