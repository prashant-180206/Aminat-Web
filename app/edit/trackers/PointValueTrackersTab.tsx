"use client";

import React from "react";
import { PtTrackerMeta } from "@/core/types/tracker";
import { useScene } from "@/hooks/SceneContext";
import PtAddTrackerCard from "./components/point/PtAddTrackerCard";
import PtConnectorFunctionsCard from "./components/point/PtConnectorFunctionsCard";
import PtTrackersList from "./components/point/PtTrackersList";
import { toast } from "sonner";

const PointValueTrackersTab = () => {
  const { scene, activeMobject, valRefresh } = useScene();

  const [trackers, setTrackers] = React.useState<PtTrackerMeta[]>([]);
  const [selectedTracker, setSelectedTracker] = React.useState<string | null>(
    null
  );

  const fetchTrackers = React.useCallback(() => {
    if (!scene) return;
    setTrackers(scene.trackerManager.getAllPtTrackerMetas());
  }, [scene]);

  React.useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  const connectorNames =
    activeMobject?.trackerconnector.getConnectorFuncNames() ?? [];

  const handleTrackerAdded = () => {
    fetchTrackers();
  };

  const handleConnectionMade = (success: boolean) => {
    // Connection made, can add additional logic here if needed
    valRefresh();
    if (success) {
      toast.success("Tracker connected to mobject");
    } else {
      toast.error("Failed to connect tracker to mobject");
    }
  };

  const handleTrackerRemoved = () => {
    fetchTrackers();
  };

  return (
    <div className="flex flex-col gap-4">
      <PtAddTrackerCard onTrackerAdded={handleTrackerAdded} />

      <PtConnectorFunctionsCard
        connectorNames={connectorNames}
        selectedTracker={selectedTracker}
        onConnectionMade={handleConnectionMade}
      />

      <PtTrackersList
        trackers={trackers}
        selectedTracker={selectedTracker}
        onTrackerSelect={setSelectedTracker}
        onTrackerRemove={handleTrackerRemoved}
      />
    </div>
  );
};

export default PointValueTrackersTab;
