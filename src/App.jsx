import { useEffect, useState } from "react";
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import ToolBox from "./ToolBox/ToolBox";

function App() {
  const [currentTool, setCurrentTool] = useState(null);
  const [superBoard, setSuperBoard] = useState(null);

  const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
  const serverURL = import.meta.env.VITE_ZEGO_SERVER_URL;

  const userID = "123456";
  const roomID = "78783";
  const userName = "Hrithika";

  const token =
    "04AAAAAGmP164ADDUpTMlha2lAMQ77aQCvKsNac6rRX4zN4E7lGpo/ajHYpCbJrpvuLdqMKM8EMDZn9LemNi4aKVySwiFXIvIw7KzpBPveJIFBBUgXcVLMJdUU+q8nPV+AYzEKTv1eoR/EMSVEy9RL5I+q3oBKLlMGZu8nNx/HKRnhCn3Z5h8ah52y38T4SiranZmhP3T4lPFv4HN9IoY7CrhM/ipClP9M8mTDqXe137+ne619RYUvlDddBpMYchfUFzXF+MSDsAE=";

  useEffect(() => {
    const initSuperBoard = async () => {
      try {
        const zg = new ZegoExpressEngine(appID, serverURL);
        const board = ZegoSuperBoardManager.getInstance();

        // 1️⃣ Initialize superboard first
        await board.init(zg, {
          parentDomID: "superboard",
          appID,
          userID,
          token,
        });

        console.log("Superboard initialized");

        // 2️⃣ Login room
        await zg.loginRoom(
          roomID,
          token,
          { userID, userName },
          { userUpdate: true }
        );

        console.log("Room login success");

        // 3️⃣ Create whiteboard
        await board.createWhiteboardView({
          name: "My Learning Platform",
          perPageWidth: 1600,
          perPageHeight: 900,
          pageCount: 1,
        });

        console.log("Whiteboard created");

        setSuperBoard(board);
        setCurrentTool(board.getToolType());
      } catch (error) {
        console.error("Whiteboard error:", error);
      }
    };

    initSuperBoard();
  }, []);

  return (
    <div className="app">
      <div id="superboard"></div>

      <ToolBox
        currentTool={currentTool}
        onClick={(tool) => {
          if (superBoard) {
            superBoard.setToolType(tool.type);
            setCurrentTool(tool.type);
          }
        }}
      />
    </div>
  );
}

export default App;
