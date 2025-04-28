import { getProfileFromUserName } from "psn-api";
import { getAuthorization } from "@/lib/auth";
import { sendResponse } from "@/lib/net/response";

export async function GET(request) {
  try {
    const authorization = await getAuthorization();
    const profile = await getProfileFromUserName(authorization, "me");

    return sendResponse(request, { data: profile });
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message,
    });
  }
}
