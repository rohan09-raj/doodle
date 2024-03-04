import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  clearCanvas,
  drawBackground,
  drawLine,
  eraseCanvas,
} from "../../components/Canvas/handlers/handlers";
import { SOCKET_EVENTS, CANVAS_EVENTS } from "../../constants/constants";

const Canvas = ({
  socketRef,
  drawerId,
  drawing,
  setDrawing,
  canvasParent,
  setCanvas,
  editOption,
  color,
}) => {
  const canvasRef = useRef(null);
  const editOptionRef = useRef(editOption);
  const colorRef = useRef(color);
  let mousedown = undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setCanvas(canvas);

    if (canvasParent.current) {
      let parentWidth = canvasParent.current.clientWidth;
      let parentHeight = canvasParent.current.clientHeight;
      let smaller = parentWidth < parentHeight ? parentWidth : parentHeight;
      canvas.width = smaller;
      canvas.height = smaller;
    }
    drawBackground(ctx, canvas);

    socketRef.current.on(
      CANVAS_EVENTS.DRAW,
      ({ color, mousedown, mousemove }) => {
        drawLine(ctx, color, mousedown, mousemove);
      }
    );

    socketRef.current.on(CANVAS_EVENTS.ERASE, ({ mousedown, mousemove }) => {
      eraseCanvas(ctx, canvas, mousedown, mousemove);
    });

    socketRef.current.on(CANVAS_EVENTS.CLEAR, () => {
      clearCanvas(ctx, canvas);
      setDrawing([]);
    });

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

  useEffect(() => {
    if (socketRef.current.id === drawerId) {
      setEventListeners(canvasRef.current, canvasRef.current.getContext("2d"));
      canvasRef.current.style.touchAction = "none";
    }
  }, [socketRef, drawerId]);

  useEffect(() => {
    colorRef.current = color;
    editOptionRef.current = editOption;
  }, [color, editOption]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawImage(ctx, canvas);

    window.addEventListener("resize", () => {
      if (canvasParent.current) {
        let parentWidth = canvasParent.current.clientWidth;
        let parentHeight = canvasParent.current.clientHeight;
        let smaller = parentWidth < parentHeight ? parentWidth : parentHeight;
        canvas.width = smaller;
        canvas.height = smaller;
      }
      drawBackground(canvas.getContext("2d"), canvas);
      drawImage(canvas.getContext("2d"), canvas);
    });
  }, [drawing]);

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

  const setEventListeners = (canvas, context) => {
    canvas.addEventListener("pointerdown", (e) => mouseDownHandler(e, context));
    canvas.addEventListener("pointermove", (e) => mouseMoveHandler(e, context));
    canvas.addEventListener("pointerup", (e) => mouseUpHandler(e, context));
    canvas.addEventListener("pointerleave", (e) => mouseUpHandler(e, context));
    canvas.addEventListener("pointercancel", (e) => mouseUpHandler(e, context));
  };

  const mouseMoveHandler = (e) => {
    if (mousedown) {
      let mousemove = {
        x: e.offsetX,
        y: e.offsetY,
      };
      const canvas = canvasRef.current;
      if (editOptionRef.current === "edit") {
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
      } else {
        const data = {
          initial: {
            x: mousedown.x / canvas.width,
            y: mousedown.y / canvas.height,
          },
          final: {
            x: mousemove.x / canvas.width,
            y: mousemove.y / canvas.height,
          },
          color: "white",
        };
        setDrawing((prev) => [...prev, data]);
        socketRef.current.emit(SOCKET_EVENTS.DRAW_DATA, {
          x1: data.initial.x,
          y1: data.initial.y,
          x2: data.final.x,
          y2: data.final.y,
          color: "white",
        });
      }

      mousedown = mousemove;
    }
  };

  const mouseDownHandler = (e) => {
    mousedown = {
      x: e.offsetX,
      y: e.offsetY,
    };
    const canvas = canvasRef.current;
    if (editOptionRef.current === "edit") {
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
    } else {
      const data = {
        initial: {
          x: mousedown.x / canvas.width,
          y: mousedown.y / canvas.height,
        },
        final: {},
        color: "white",
      };
      setDrawing((prev) => [...prev, data]);
      socketRef.current.emit(SOCKET_EVENTS.DRAW_DATA, {
        x1: data.initial.x,
        y1: data.initial.y,
        color: "white",
      });
    }
  };

  const mouseUpHandler = () => {
    mousedown = undefined;
  };

  return (
    <canvas
      height={500}
      width={700}
      ref={canvasRef}
      style={{
        cursor: "crosshair",
      }}
    />
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
  color: PropTypes.string,
};

export default Canvas;
