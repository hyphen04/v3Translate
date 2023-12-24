import express, { Request, Response, Router } from 'express';
import { pagePool } from '../browser/pagepool';
import { parsePage } from '../parser/parser';

type Options = {
  text: string;
  from: string;
  to: string;
  lite: boolean;
};

const handler = async (req: Request, res: Response) => {
  const options = {
    ...req.query,
    ...req.body,
  } as Options;
  const { text, from = 'auto', to = 'es', lite = false } = options;

  if (!text) {
    res.status(400).json({
      error: 1,
      message: 'text is required',
    });
    return;
  }

  const page = pagePool.getPage();
  if (!page) {
    res.status(400).json({
      error: 1,
      message:
        "We're running out of resources. Please wait for a moment and retry.",
    });
    return;
  }

  let response: Record<string, any>;
  try {
    const result = await parsePage(page, { text, from, to, lite });
    response = {
      result: result.result,
      pronunciation: result.pronunciation,
      from: {
        pronunciation: result.fromPronunciation,
        didYouMean: result.fromDidYouMean,
        suggestions: result.fromSuggestions,
      },
      definitions: result.definitions,
      examples: result.examples,
      translations: result.translations,
    };

    Object.keys(response).forEach((key) => {
      if (
        response[key] === undefined ||
        (typeof response[key] === 'object' &&
          Object.keys(response[key]).length === 0) ||
        (Array.isArray(response[key]) && response[key].length === 0)
      )
        delete response[key];
    });

    res.status(200).json(response);
  } catch (e) {
    throw e;
  } finally {
    pagePool.releasePage(page);
  }
};

const router = Router();

router.use(express.json()); // Add this line
router.use(express.urlencoded({ extended: true })); // Add this line

router.get('/', async (req: Request, res: Response) => {
  await handler(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await handler(req, res);
});

export default router;