import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import useWebSocket from "react-use-websocket";

import event from "../../utils/event";
import { EVENT, WS_URL } from "../../constants/constants";

import styles from "./Canvas.module.css";

const Canvas = () => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: event.isDrawEvent,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      setLines(lastJsonMessage.data.canvasData);
    }
  }, [lastJsonMessage]);

  const handleLineChange = () => {
    sendJsonMessage({
      type: EVENT.DRAW,
      content: lines,
    });
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    handleLineChange();
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
    handleLineChange();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className={styles.canvas}>
      <div className={styles.canvas__stage}>
        <Stage
          width={window.innerWidth / 2}
          height={window.innerHeight / 2}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <select
        className={styles.canvas__controls}
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </div>
  );
};

export default Canvas;
