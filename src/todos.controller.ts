import { TodoService } from "./todos.service";
import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator/check";
import { logger } from "./logger";
import { inspect } from "util";

export class TodosController {
  todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
  }

  index(req: Request, res: Response) {
    const list = this.todoService.get();

    res.status(200).json(list);
  };

  get(req: Request, res: Response) {
    const todo = this.todoService.get(req.params.id);
    if (!todo) {
      res.status(404).json({message: "Not found"});
      return;
    }

    res.status(200).json(todo);
  };

  private validate(request: Request) {
    var errors = validationResult(request);

    if (!errors.isEmpty()) {
      return errors.array()
        .reduce(
          function(acc: any, val: any) {
            return {...acc, [val.param]: val.msg};
          },
          {}
        );
    } else {
      return null;
    }
  }

  validateTodoCreate = [
    body('title').not().isEmpty().withMessage('cannot be blank'),
    body('done').optional().isBoolean().withMessage('can be true or false')
  ];
  create(req: Request, res: Response) {
    var validationErrors = this.validate(req);
    if (validationErrors) {
      logger.info(`CREATE validation error: ${inspect(validationErrors)}`);
      res.status(422).json({errors: validationErrors});
      return;
    }

    const todo = this.todoService.create(req.body);
    res.status(201).json(todo);
  };

  // Each field might be absent, validate individually
  validateTodoTitleUpdate =
    body('title').optional().not().isEmpty().withMessage('cannot be blank');
  validateTodoDoneUpdate =
    body('done').optional().isBoolean().withMessage('can be true or false');

  update(req: Request, res: Response) {
    var validationErrors = this.validate(req);
    if (validationErrors) {
      logger.info(`UPDATE validation error: ${inspect(validationErrors)}`);
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

  destroy(req: Request, res: Response) {
    const todo = this.todoService.delete(req.params.id);
    if (!todo) {
      res.status(404).json({message: "Not found"});
      return;
    }

    res.status(200).json(todo);
  }
}

