import express, { Application } from "express";
import { config } from "../config/config";
import errorMiddleware from "../middlewares/error.middleware";

interface AppOptions {
  middleWares: any[];
  controllers: any[];
}

export class App {
  private readonly app: Application;

  constructor(appInit: AppOptions) {
    this.app = express();

    this.routes(appInit.controllers);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`App listening ${config.port}`);
    });
  }

  private routes(controllers: any[]): void {
    controllers.forEach((controller) => {
      this.app.use("/api/variants", controller.router);
    });
  }

  // private middlewares(middleWares: any[]): void {
  //   middleWares.forEach((middleWare) => {
  //     this.app.use(middleWare);
  //   });
  // }
}
