import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { textbookValidationSchema } from 'validationSchema/textbooks';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTextbooks();
    case 'POST':
      return createTextbook();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTextbooks() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.textbook
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'textbook'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createTextbook() {
    await textbookValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.chapter?.length > 0) {
      const create_chapter = body.chapter;
      body.chapter = {
        create: create_chapter,
      };
    } else {
      delete body.chapter;
    }
    if (body?.study_session?.length > 0) {
      const create_study_session = body.study_session;
      body.study_session = {
        create: create_study_session,
      };
    } else {
      delete body.study_session;
    }
    const data = await prisma.textbook.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
