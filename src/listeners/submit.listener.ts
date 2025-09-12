import api from "@flatfile/api";

import { jobHandler } from "@flatfile/plugin-job-handler";
import { submitBlueprint } from "../blueprints/actions/submit.action";


export const submitListener = jobHandler(`*:${submitBlueprint.operation}`, async (event, tick) => {
  const { payload } = event;
  const { jobId, workbookId } = event.context;

  const webhookReceiver = process.env.WEBHOOK_SITE_URL as string;
  // Acknowledge the job
  try {
    await tick(10, "Starting job to submit action to webhook.site");

    // Collect all Sheet and Record data from the Workbook
    const { data: sheets } = await api.sheets.list({ workbookId });
    const records: { [name: string]: any } = {};
    for (const [index, element] of sheets.entries()) {
      records[`Sheet[${index}]`] = await api.records.get(element.id);
    }

    // Send the data to our webhook.site URL
    const response = await fetch(webhookReceiver, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        method: "fetch",
        sheets,
        records,
      }),
    });

    if (response.status !== 200) {
      throw new Error("Failed to submit data to webhook.site");
    }

    // Otherwise, complete the job
    return {
      outcome: {
        message: `Data was successfully submitted to Webhook.site. Go check it out at ${webhookReceiver}.`,
      },
    };
  } catch (error) {
    // If an error is thrown, fail the job
    console.error(error);
    throw error;
  }
});
