import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

init({
  //   dsn: "https://dce9661c23924a483e39de4d0ed3a186@o4508289484849152.ingest.us.sentry.io/4508289899626496",
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
