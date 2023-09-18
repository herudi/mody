import { type ServerOptions } from "node:https";
export type TAny = any;
export type FetchHandler = (req: Request) => Response;
export type FetchOptions = ServerOptions & {
  port?: number;
  onListen?: (opts: FetchOptions) => void;
  immediate?: boolean;
};
