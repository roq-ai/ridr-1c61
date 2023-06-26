import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { carrierValidationSchema } from 'validationSchema/carriers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCarriers();
    case 'POST':
      return createCarrier();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCarriers() {
    const data = await prisma.carrier
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'carrier'));
    return res.status(200).json(data);
  }

  async function createCarrier() {
    await carrierValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.bid?.length > 0) {
      const create_bid = body.bid;
      body.bid = {
        create: create_bid,
      };
    } else {
      delete body.bid;
    }
    const data = await prisma.carrier.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
