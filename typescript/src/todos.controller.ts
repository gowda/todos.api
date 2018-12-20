import { Request, Response } from "express";
import { body, validationResult } from "express-validator/check";
import { inspect } from "util";
import { TodoService } from "./todos.service";

export class TodosController {
  public validateTodoCreate = [
    body("title").not().isEmpty().withMessage("cannot be blank"),
    body("done").optional().isBoolean().withMessage("can be true or false"),
  ];

  // Each field might be absent, validate individually
  public validateTodoTitleUpdate =
    body("title").optional().not().isEmpty().withMessage("cannot be blank");
  public validateTodoDoneUpdate =
    body("done").optional().isBoolean().withMessage("can be true or false");

  private todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
  }

  public index(req: Request, res: Response) {
    const list = this.todoService.get();

    res.status(200).json(list);
  }

  public get(req: Request, res: Response) {
    const todo = this.todoService.get(req.params.id);
    if (!todo) {
      res.status(404).json({message: "Not found"});
      return;
    }

    res.status(200).json(todo);
  }

  public create(req: Request, res: Response) {
    const validationErrors = this.validate(req);
    if (validationErrors) {
      req.logger.info(`CREATE validation error: ${inspect(validationErrors)}`);
      res.status(422).json({errors: validationErrors});
      return;
    }

    const todo = this.todoService.create(req.body);
    res.status(201).json(todo);
  }

  public update(req: Request, res: Response) {
    const validationErrors = this.validate(req);
    if (validationErrors) {
      req.logger.info(`UPDATE validation error: ${inspect(validationErrors)}`);
      res.status(422).json({errors: validationErrors});
      return;
    }

    const todo = this.todoService.update(req.params.id, req.body);
    if (!todo) {
      res.status(404).json({message: "Not found"});
      return;
    }

    res.status(200).json(todo);
  }

  public destroy(req: Request, res: Response) {
    const todo = this.todoService.delete(req.params.id);
    if (!todo) {
      res.status(404).json({message: "Not found"});
      return;
    }

    res.status(200).json(todo);
  }

  private validate(request: Request) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return errors.array()
        .reduce(
          (acc: any, val: any) => {
            return {...acc, [val.param]: val.msg};
          },
          {}
        );
    } else {
      return null;
    }
  }
}
