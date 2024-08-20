"use client";
import React, { useEffect, useRef } from "react";

export default function ScratchImage({
  sizes,
  bgImage,
  frontImage,
}: {
  sizes: number;
  bgImage: string;
  frontImage: string;
}) {
  const canvasRef = useRef(null); // Ref canvas
  useEffect(() => {
    if (canvasRef.current) {
      // check canvas no null
      const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
        "2d"
      ); // fixing type problem
      if (canvasContext) {
        // checking that we have context
        var background = new Image(); // creating and populating front image canvas
        background.src = frontImage;
        background.onload = function () {
          canvasContext.drawImage(background, 0, 0, sizes, sizes);
        };

        // handling position mouse
        const getMouseCoordinates = (event: any) => {
          const rect: any =
            canvasRef.current &&
            (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
          const x: any =
            rect && (event.pageX || event.touches[0].pageX) - rect.left;
          const y = rect && (event.pageY || event.touches[0].pageY) - rect.top;
          return { x, y };
        };

        // scratching canvas
        const scratch = (x: number, y: number) => {
          canvasContext.globalCompositeOperation = "destination-out";
          canvasContext.beginPath();
          canvasContext.arc(x, y, sizes * 0.1, 0, 2 * Math.PI);
          canvasContext.fill();
        };

        const handleMouseMove = (event: any) => {
          const { x, y }: { x: number; y: any } = getMouseCoordinates(event);
          scratch(x, y);
        };

        // getting viewport
        const isTouchDevice = "ontouchstart" in window;
        (canvasRef.current as HTMLCanvasElement).addEventListener(
          isTouchDevice ? "touchmove" : "mousemove",
          handleMouseMove
        );

        // removing evenlistener
        return () => {
          if (canvasRef.current) {
            (canvasRef.current as HTMLCanvasElement).removeEventListener(
              isTouchDevice ? "touchmove" : "mousemove",
              handleMouseMove
            );
          }
        };
      }
    }
  }, [canvasRef]);

  return (
    <div className={`container relative w-[${sizes}px] h-[${sizes}px]`}>
      <canvas
        ref={canvasRef}
        id="scratch"
        width={sizes}
        height={sizes}
        className="absolute top-0 left-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />
    </div>
  );
}
