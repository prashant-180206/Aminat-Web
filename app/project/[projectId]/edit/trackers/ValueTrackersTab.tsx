"use client";

import React from "react";
import { TrackerMeta } from "@/core/types/tracker";
import { useScene } from "@/hooks/SceneContext";
import AddTrackerCard from "./components/value/AddTrackerCard";
import ConnectorFunctionsCard from "./components/value/ConnectorFunctionsCard";
import TrackersList from "./components/value/TrackersList";

const ValueTrackersTab = () => {
  const { scene, activeMobject, valRefresh, valToggle } = useScene();
  void valToggle;

  const [trackers, setTrackers] = React.useState<TrackerMeta[]>([]);
  const [selectedTracker, setSelectedTracker] = React.useState<string | null>(
    null
  );

  const fetchTrackers = React.useCallback(() => {
    if (!scene) return;
    setTrackers(scene.trackerManager.getAllTrackerMetas());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, valToggle]);

  React.useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  const connectorNames =
    activeMobject?.trackerconnector.getConnectorFuncNames() ?? [];

  const handleTrackerAdded = () => {
    fetchTrackers();
  };

  const handleTrackerRemoved = () => {
    fetchTrackers();
    valRefresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <AddTrackerCard onTrackerAdded={handleTrackerAdded} />

      <ConnectorFunctionsCard
        connectorNames={connectorNames}
        selectedTracker={selectedTracker}
      />

      <TrackersList
        trackers={trackers}
        selectedTracker={selectedTracker}
        onTrackerSelect={setSelectedTracker}
        onTrackerRemove={handleTrackerRemoved}
      />
    </div>
  );
};

export default ValueTrackersTab;
