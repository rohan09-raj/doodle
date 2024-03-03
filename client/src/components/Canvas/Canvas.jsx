import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { BsEraserFill } from "react-icons/bs";
import { drawBackground, drawLine, clearCanvas } from "./handlers/handlers";
import styles from "./Canvas.module.css";
import IconButton from "../basic/IconButton/IconButton";
import { SOCKET_EVENTS } from "../../constants/constants";

const Canvas = ({
  socketRef,
  drawerId,
  drawing,
  setDrawing,
  editOption,
  setEditOption,
  color,
}) => {
  const canvasRef = useRef(null);
  const colorRef = useRef(color);
  let mousedown = undefined;

  //  Main useeffect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawBackground(ctx, canvas);
    socketRef.current.on(
      SOCKET_EVENTS.DRAW_DATA,
      ({ x1, y1, x2, y2, color }) => {
        const data = {
          initial: {
            x: x1,
            y: y1,
          },
          final: {
            x: x2,
            y: y2,
          },
          color: color,
        };
        setDrawing((prev) => [...prev, data]);
      }
    );
  }, [socketRef]);

  //  Drawerid useeffect
  useEffect(() => {
    if (socketRef.current.id === drawerId) {
      setEventListeners(canvasRef.current, canvasRef.current.getContext("2d"));
      canvasRef.current.style.touchAction = "none";
    }
  }, [socketRef, drawerId]);

  //  Color / Edit Option change useEffect
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  //  On drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawImage(ctx, canvas);

    window.addEventListener("resize", () => {
      drawBackground(canvas.getContext("2d"), canvas);
      drawImage(canvas.getContext("2d"), canvas);
    });
  }, [drawing]);

  //  Draw complete
  const drawImage = (ctx, canvas) => {
    clearCanvas(ctx, canvas);
    drawing.forEach((element) => {
      const initial = {
        x: element.initial.x * canvas.width,
        y: element.initial.y * canvas.height,
      };
      const final = {
        x: element.final.x * canvas.width,
        y: element.final.y * canvas.height,
      };
      if (final.x && final.y) {
        drawLine(ctx, element.color, initial, final);
      } else {
        drawLine(ctx, element.color, initial);
      }
    });
  };

  //  Set and remove pointer event listeners
  const setEventListeners = (canvas, context) => {
    canvas.addEventListener("pointerdown", (e) => mouseDownHandler(e, context));
    canvas.addEventListener("pointermove", (e) => mouseMoveHandler(e, context));
    canvas.addEventListener("pointerup", (e) => mouseUpHandler(e, context));
    canvas.addEventListener("pointerleave", (e) => mouseUpHandler(e, context));
    canvas.addEventListener("pointercancel", (e) => mouseUpHandler(e, context));
  };

  //  Event handlers
  const mouseMoveHandler = (e) => {
    if (mousedown) {
      let mousemove = {
        x: e.offsetX,
        y: e.offsetY,
      };
      const canvas = canvasRef.current;
      const data = {
        initial: {
          x: mousedown.x / canvas.width,
          y: mousedown.y / canvas.height,
        },
        final: {
          x: mousemove.x / canvas.width,
          y: mousemove.y / canvas.height,
        },
        color: colorRef.current,
      };
      setDrawing((prev) => [...prev, data]);
      socketRef.current.emit(SOCKET_EVENTS.DRAW_DATA, {
        x1: data.initial.x,
        y1: data.initial.y,
        x2: data.final.x,
        y2: data.final.y,
        color: colorRef.current,
      });

      mousedown = mousemove;
    }
  };

  const mouseDownHandler = (e) => {
    mousedown = {
      x: e.offsetX,
      y: e.offsetY,
    };
    const canvas = canvasRef.current;
    const data = {
      initial: {
        x: mousedown.x / canvas.width,
        y: mousedown.y / canvas.height,
      },
      final: {},
      color: colorRef.current,
    };
    setDrawing((prev) => [...prev, data]);
    socketRef.current.emit(SOCKET_EVENTS.DRAW_DATA, {
      x1: data.initial.x,
      y1: data.initial.y,
      color: colorRef.current,
    });
  };

  const mouseUpHandler = () => {
    mousedown = undefined;
  };

  const handleClear = (canvas) => {
    if (socketRef.current.id === drawerId) {
      clearCanvas(canvas.getContext("2d"), canvas);
      setDrawing([]);
      socketRef.current.emit(SOCKET_EVENTS.CLEAR);
    }
  };

  return (
    <div className={styles.canvas}>
      <div className={styles.canvas__stage}>
        <canvas
          height={500}
          width={700}
          ref={canvasRef}
          style={{
            cursor: "url(/icons/cursor.svg) 5 5, crosshair",
          }}
        />
      </div>
      <div className={styles.canvas__controls}>
        <IconButton
          isSelected={editOption === "edit"}
          icon={<MdModeEdit size={20} />}
          onClick={() => {
            setEditOption("edit");
          }}
        />

        <IconButton
          icon={<BsEraserFill size={20} />}
          onClick={() => {
            handleClear(canvasRef.current);
          }}
        />
      </div>
    </div>
  );
};

Canvas.propTypes = {
  socketRef: PropTypes.object,
  drawerId: PropTypes.string,
  drawing: PropTypes.array,
  setDrawing: PropTypes.func,
  canvasParent: PropTypes.object,
  setCanvas: PropTypes.func,
  editOption: PropTypes.string,
  setEditOption: PropTypes.func,
  color: PropTypes.string,
  options: PropTypes.array,
};

export default Canvas;
