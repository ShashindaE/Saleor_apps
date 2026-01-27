/* eslint-disable */
import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next";
import { wrapWithLoggerContext } from "@saleor/apps-logger/node";
import { withSpanAttributes } from "@saleor/apps-otel/src/with-span-attributes";

import { createInstrumentedGraphqlClient } from "../../lib/create-instrumented-graphql-client";
import { createLogger } from "../../logger";
import { loggerContext } from "../../logger-context";
import { fetchSaleorVersion } from "../../modules/feature-flag-service/fetch-saleor-version";
import { REQUIRED_SALEOR_VERSION, saleorApp } from "../../saleor-app";
import { NextApiRequest, NextApiResponse } from "next";

const allowedUrlsPattern = process.env.ALLOWED_DOMAIN_PATTERN;

const logger = createLogger("createAppRegisterHandler");

/**
 * Required endpoint, called by Saleor to install app.
 * It will exchange tokens with app, so saleorApp.apl will contain token
 */
const sdkHandler = wrapWithLoggerContext(
  withSpanAttributes(
    createAppRegisterHandler({
      apl: saleorApp.apl,
      allowedSaleorUrls: [
        (url) => true,
      ],
      async onRequestVerified(req, { authData: { token, saleorApiUrl }, respondWithError }) {
        const logger = createLogger("onRequestVerified");

        try {
          const client = createInstrumentedGraphqlClient({
            saleorApiUrl: saleorApiUrl,
            token: token,
          });

          const saleorVersion = await fetchSaleorVersion(client);
          logger.info({ saleorVersion }, "Fetched Saleor Version");
        } catch (e: unknown) {
          const message = (e as Error)?.message ?? "Unknown error";

          logger.debug(
            { message, saleorApiUrl },
            "Error during fetching saleor version in onRequestVerified handler",
          );
        }

        logger.info("Saleor version validated successfully");
      },
    }),
  ),
  loggerContext,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORRECTION: Map "pmtraders-" headers to "saleor-" headers so the SDK can recognize them
  if (req.headers["pmtraders-api-url"]) {
    req.headers["saleor-api-url"] = req.headers["pmtraders-api-url"];
  }
  if (req.headers["pmtraders-domain"]) {
    req.headers["saleor-domain"] = req.headers["pmtraders-domain"];
  }

  // Forward to SDK handler
  return sdkHandler(req, res);
}
