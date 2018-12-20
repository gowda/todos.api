import { Logger } from 'winston'

declare global {
  namespace Express {
    export interface Request {
      logger: Logger
    }
  }
}
