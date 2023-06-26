import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bidValidationSchema } from 'validationSchema/bids';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bid
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBidById();
    case 'PUT':
      return updateBidById();
    case 'DELETE':
      return deleteBidById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBidById() {
    const data = await prisma.bid.findFirst(convertQueryToPrismaUtil(req.query, 'bid'));
    return res.status(200).json(data);
  }

  async function updateBidById() {
    await bidValidationSchema.validate(req.body);
    const data = await prisma.bid.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBidById() {
    const data = await prisma.bid.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
