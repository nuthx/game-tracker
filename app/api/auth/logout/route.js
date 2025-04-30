import { cookies } from "next/headers";
import { sendResponse } from "@/lib/http";

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("tktk");

    return sendResponse(request, {});
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    });
  }
}
