import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Anchor } from '@mantine/core';

import type { RouterOutputs } from "@homarr/api";
import { clientApi } from "@homarr/api/client";

import { PingDot } from "./ping-dot";


interface PingIndicatorProps {
  appId: string;
  href: string;
}

export const PingIndicator = ({ appId, href }: PingIndicatorProps) => {
  const [ping] = clientApi.widget.app.ping.useSuspenseQuery(
    {
      id: appId,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const [pingResult, setPingResult] = useState<RouterOutputs["widget"]["app"]["ping"]>(ping);

  clientApi.widget.app.updatedPing.useSubscription(
    { id: appId },
    {
      onData(data) {
        setPingResult(data);
      },
    },
  );

  const isError = "error" in pingResult || pingResult.statusCode >= 500;

  return (
    <Anchor onClick={() => {window.open(href, "_blank");}}>
      <PingDot
          icon={isError ? IconX : IconCheck}
          color={isError ? "red" : "green"}
          tooltip={"statusCode" in pingResult ? pingResult.statusCode.toString() : pingResult.error}
      />
    </Anchor>
  );
};
