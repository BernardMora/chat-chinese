import { useUserContext } from "@/context/UserContext";
import { useState } from "react";

export function ChangePlaybackSpeed({
  handleShowPlaybackSpeed,
}: {
  handleShowPlaybackSpeed: () => void;
}) {
  const { uid, updateUser, preferences, setPreferences } = useUserContext()!;
  const [playbackSpeed, setPlaybackSpeed] = useState(
    preferences!.playbackSpeed * 100
  );

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackSpeed(Number(event.target.value));
  };

  const handleConfirmPlaybackSpeed = async (speed: number) => {
    await updateUser!(uid!, { preferences: { playbackSpeed: speed / 100 } });
    setPreferences({ ...preferences, playbackSpeed: speed / 100 });
    handleShowPlaybackSpeed();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modify Playback Speed</h2>
        <div className="mb-4">
          <input
            type="range"
            min="20"
            max="200"
            value={playbackSpeed}
            onChange={handleSpeedChange}
            className="w-full"
          />
        </div>
        <div className="text-center mb-4">
          <span className="text-lg">{playbackSpeed}%</span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleShowPlaybackSpeed}
            className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => handleConfirmPlaybackSpeed(playbackSpeed)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
