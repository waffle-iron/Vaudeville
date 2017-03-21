import * as express from 'express';

import { IRouteMetadata, IVerbMetadata, METADATA_KEYS, ROUTES } from './decorators';

import { Container } from 'inversify';

export interface IRouteConfig {
  rootPath?: string;
}

class Server {
  private express: express.Application = express();
  private configFunc: (app: express.Application) => void;
  private errorConfigFunc: (app: express.Application) => void;
  private routes: any[];

  constructor(
    private container: Container,
    private routeConfig?: IRouteConfig,
    private router?: express.Router,
  ) {
    this.container = container;
    this.router = router || express.Router();

    this.routes = this.getRoutes();
  }

  public setConfig(configFunc: (app: express.Application) => void): Server {
    this.configFunc = configFunc;
    return this;
  }

  public setErrorConfig(errorConfigFunc: (app: express.Application) => void): Server {
    this.errorConfigFunc = errorConfigFunc;
    return this;
  }

  public start(): express.Application {
    if (this.configFunc) {
      this.configFunc.apply(undefined, [this.express]);
    }

    this.registerRoutes();

    if (this.errorConfigFunc) {
      this.errorConfigFunc.apply(undefined, [this.express]);
    }

    return this.express;
  }

  private getRoutes(): any[] {
    return ROUTES.map((route: any) => this.container.get(route));
  }

  private registerRoutes(): void {
    ROUTES.forEach((routeConstructor: any) => {
      const routeMetadata: IRouteMetadata =
        Reflect.getOwnMetadata(METADATA_KEYS.route, routeConstructor);

      const verbMetadata: IVerbMetadata[] =
        Reflect.getOwnMetadata(METADATA_KEYS.verb, routeConstructor);

      if (routeMetadata && verbMetadata) {
        const router: express.Router = express.Router();

        verbMetadata.forEach((metadata: IVerbMetadata) => {
          const handler = this.createHandler(routeConstructor, metadata.key);
          router[metadata.verb](
            `${metadata.path}`,
            ...routeMetadata.middleware,
            ...metadata.middleware,
            handler,
          );
          console.log(`${metadata.verb.toUpperCase()} ${this.routeConfig.rootPath}${routeMetadata.path}${metadata.path}`);
        });

        this.express.use(`${this.routeConfig.rootPath}${routeMetadata.path}`, router);
      }
    });
  }

  private createHandler(routeConstructor: any, key: string): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const route = this.container.get(routeConstructor);
      const result: any = route[key](req, res, next);
      if (result && result instanceof Promise) {
        result.then((value: any) => {
          if (value && !res.headersSent) {
            res.send(value);
          }
        }).catch((error: any) => {
          next(error);
        });
      } else if (result && !res.headersSent) {
        res.send(result);
      }
    };
  }
}

export { Server };
