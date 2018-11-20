import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator/check";
import { TodoService } from "./todos.service";
import { logger } from "./logger";
import { inspect } from "util";

const todoService = new TodoService();

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  const list = todoService.get();

  res.status(200).json(list);
});

router.get('/:id', (req: Request, res: Response) => {
  const todo = todoService.get(req.params.id);
  if (!todo) {
    res.status(404).json({message: "Not found"});
    return;
  }

  res.status(200).json(todo);
});

function validate(request: Request) {
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

const validateTodoCreate = [
  body('title').not().isEmpty().withMessage('cannot be blank'),
  body('done').optional().isBoolean().withMessage('can be true or false')
];
router.post('/', validateTodoCreate, (req: Request, res: Response) => {
  var validationErrors = validate(req);
  if (validationErrors) {
    logger.info(`CREATE validation error: ${inspect(validationErrors)}`);
    res.status(422).json({errors: validationErrors});
    return;
  }

  const todo = todoService.create(req.body);
  res.status(201).json(todo);
});

// Each field might be absent, validate individually
const validateTodoTitleUpdate =
  body('title').optional().not().isEmpty().withMessage('cannot be blank');
const validateTodoDoneUpdate =
  body('done').optional().isBoolean().withMessage('can be true or false');

  router.put('/:id',
  validateTodoTitleUpdate,
  validateTodoDoneUpdate,
  (req: Request, res: Response) => {
    var validationErrors = validate(req);
    if (validationErrors) {
      logger.info(`UPDATE validation error: ${inspect(validationErrors)}`);
      res.status(422).json({errors: validationErrors});
      return;
    }

    const todo = todoService.update(req.params.id, req.body);
    if (!todo) {
      res.status(404).json({message: "Not found"});
      return;
    }

    res.status(200).json(todo);
  }
);

router.delete('/:id', (req: Request, res: Response) => {
  const todo = todoService.delete(req.params.id);
  if (!todo) {
    res.status(404).json({message: "Not found"});
    return;
  }

  res.status(200).json(todo);
})
