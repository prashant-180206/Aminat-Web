"use client";

import React from "react";
import { TrackerMeta } from "@/core/types/tracker";
import { useScene } from "@/hooks/SceneContext";
import AddTrackerCard from "./components/value/AddTrackerCard";
import ConnectorFunctionsCard from "./components/value/ConnectorFunctionsCard";
import TrackersList from "./components/value/TrackersList";

const ValueTrackersTab = () => {
  const { scene, activeMobject } = useScene();

  const [trackers, setTrackers] = React.useState<TrackerMeta[]>([]);
  const [selectedTracker, setSelectedTracker] = React.useState<string | null>(
    null
  );
  const [updaterIds, setUpdaterIds] = React.useState<string[]>([]);

  const fetchTrackers = React.useCallback(() => {
    if (!scene) return;
    setTrackers(scene.trackerManager.getAllTrackerMetas());
  }, [scene]);

  React.useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  const connectorNames =
    activeMobject?.trackerconnector.getConnectorFuncNames() ?? [];

  const handleTrackerAdded = () => {
    fetchTrackers();
  };

  const handleConnectionMade = (success: boolean, id: string | null) => {
    if (success && id) {
      setUpdaterIds((prev) => [...prev, id]);
    }
  };

  const handleTrackerRemoved = () => {
    fetchTrackers();
  };

  return (
    <div className="flex flex-col gap-4">
      <AddTrackerCard onTrackerAdded={handleTrackerAdded} />

      <ConnectorFunctionsCard
        connectorNames={connectorNames}
        selectedTracker={selectedTracker}
        onConnectionMade={handleConnectionMade}
      />

      <TrackersList
        trackers={trackers}
        selectedTracker={selectedTracker}
        updaterIds={updaterIds}
        onTrackerSelect={setSelectedTracker}
        onTrackerRemove={handleTrackerRemoved}
      />
    </div>
  );
};

export default ValueTrackersTab;
