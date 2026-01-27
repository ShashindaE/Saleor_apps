import { SALEOR_API_URL_HEADER, SALEOR_AUTHORIZATION_BEARER_HEADER } from "@saleor/app-sdk/headers";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { getBaseUrl } from "../../lib/get-base-url";

export const createTrpcContext = async ({ res, req }: trpcNext.CreateNextContextOptions) => {
  const baseUrl = getBaseUrl(req.headers);

  // CORRECTION: Map "pmtraders-" headers to "saleor-" headers so TRPC can authenticate
  const saleorApiUrl = (req.headers[SALEOR_API_URL_HEADER] || req.headers["pmtraders-api-url"]) as string | undefined;

  return {
    token: req.headers[SALEOR_AUTHORIZATION_BEARER_HEADER] as string | undefined,
    saleorApiUrl: saleorApiUrl,
    appId: undefined as undefined | string,
    ssr: undefined as undefined | boolean,
    baseUrl,
  };
};

export type TrpcContext = inferAsyncReturnType<typeof createTrpcContext>;
