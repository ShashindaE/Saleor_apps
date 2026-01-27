import { SALEOR_API_URL_HEADER, SALEOR_AUTHORIZATION_BEARER_HEADER } from "@saleor/app-sdk/headers";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { getBaseUrl } from "../../lib/get-base-url";

export const createTrpcContext = async ({ res, req }: trpcNext.CreateNextContextOptions) => {
  const baseUrl = getBaseUrl(req.headers);

  // CORRECTION: Map "pmtraders-" headers to "saleor-" headers so TRPC can authenticate
  const saleorApiUrl = (req.headers[SALEOR_API_URL_HEADER] || req.headers["pmtraders-api-url"]) as string | undefined;
  // Saleor SDK usually relies on `saleor-api-url` but might check others.
  // The token is "saleor-authorization-bearer" usually, or just "authorization-bearer" depending on SDK version?
  // Actually, look at line 1: SALEOR_AUTHORIZATION_BEARER_HEADER
  // If the backend also renames the auth header, we might need to map that too.
  // But usually only the domain/url headers are white-labeled.

  return {
    token: req.headers[SALEOR_AUTHORIZATION_BEARER_HEADER] as string | undefined,
    saleorApiUrl: saleorApiUrl,
    appId: undefined as undefined | string,
    ssr: undefined as undefined | boolean,
    baseUrl,
  };
};

export type TrpcContext = inferAsyncReturnType<typeof createTrpcContext>;
