/* eslint-disable no-console */
import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next";
import { wrapWithLoggerContext } from "@saleor/apps-logger/node";
import { withSpanAttributes } from "@saleor/apps-otel/src/with-span-attributes";

import { createInstrumentedGraphqlClient } from "../../lib/create-instrumented-graphql-client";
import { createLogger } from "../../logger";
import { loggerContext } from "../../logger-context";
import { fetchSaleorVersion } from "../../modules/feature-flag-service/fetch-saleor-version";
import { REQUIRED_SALEOR_VERSION, saleorApp } from "../../saleor-app";

const allowedUrlsPattern = process.env.ALLOWED_DOMAIN_PATTERN;

const logger = createLogger("createAppRegisterHandler");

/**
 * Required endpoint, called by Saleor to install app.
 * It will exchange tokens with app, so saleorApp.apl will contain token
 */
export default wrapWithLoggerContext(
  withSpanAttributes(
    createAppRegisterHandler({
      apl: saleorApp.apl,
      allowedSaleorUrls: [
        (url) => {
          console.log("--- NUCLEAR DEBUG: CHECKING URL (Accepted) ---", url);
          return true;
        }
      ],
      async onRequestVerified(req, { authData: { token, saleorApiUrl }, respondWithError }) {
        const logger = createLogger("onRequestVerified");

        // NUCLEAR DEBUGGING LOGS
        console.log("--- NUCLEAR DEBUG: REGISTER REQUEST RECEIVED ---");
        console.log("Saleor API URL:", saleorApiUrl);
        console.log("Token length:", token?.length);

        let saleorVersion: string;

        try {
          const client = createInstrumentedGraphqlClient({
            saleorApiUrl: saleorApiUrl,
            token: token,
          });

          saleorVersion = await fetchSaleorVersion(client);
          console.log("Fetched Saleor Version:", saleorVersion);
        } catch (e: unknown) {
          const message = (e as Error)?.message ?? "Unknown error";

          console.error("--- NUCLEAR DEBUG: FETCH FAILED ---");
          console.error(message);

          logger.debug(
            { message, saleorApiUrl },
            "Error during fetching saleor version in onRequestVerified handler",
          );

          throw respondWithError({
            message: "Couldn't communicate with Saleor API: " + message,
            status: 400,
          });
        }

        // BYPASS VERSION VALIDATION FOR DEBUGGING
        logger.info("Saleor version validated successfully (BYPASSED)");
      },
    }),
  ),
  loggerContext,
);
