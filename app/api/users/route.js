import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";

export async function GET(request) {
  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } });
    return sendResponse(request, {
      data: { 
        username: user.username,
        npsso: `${user.npsso.slice(0, 4)}****${user.npsso.slice(-4)}`,
        psnId: user.psnId
      }
    });
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    });
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();

    if (data.new_username) {
      await prisma.user.update({
        where: { id: 1 },
        data: { username: data.new_username }
      });
    }

    if (data.new_password) {
      await prisma.user.update({
        where: { id: 1 },
        data: { password: data.new_password }
      });
    }

    if (data.new_npsso) {
      await prisma.user.update({
        where: { id: 1 },
        data: { npsso: data.new_npsso }
      });
    }

    if (data.new_psnId) {
      await prisma.user.update({
        where: { id: 1 },
        data: { psnId: data.new_psnId }
      });
    }

    return sendResponse(request, {});
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    });
  }
}
