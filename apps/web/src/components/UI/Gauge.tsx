import { createStyles } from "antd-style";
import { m, LazyMotion, domAnimation, useMotionValue } from "framer-motion";
import { useState, MouseEvent, useEffect } from "react";

const useStyles = createStyles(({ token }) => ({
  gauge: {
    position: "relative",
  },
  dial: {
    position: "relative",
    width: "100%",
    aspectRatio: "2/1",
    backgroundColor: token.colorBgElevated,
    borderRadius: "9999px 9999px 0 0",
    cursor: "pointer",
    overflow: "hidden",
  },
  spark: {
    position: "absolute",
    width: "20px",
    height: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    pointerEvents: "none",
    filter: "blur(20px)",
    mixBlendMode: "lighten",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    "$gauge:hover &": {
      opacity: 1,
    },
  },
  needle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50%",
    height: "5%",
    transformOrigin: "right",
    backgroundColor: token.volcano,
  },
}));

interface GaugeProps {
  value: number;
  onChange: (value: number) => void;
}

export function Gauge({ value = -100, onChange }: GaugeProps) {
  const { styles } = useStyles();

  const [angle, setAngle] = useState(((value - 100) / 100 / 2) * Math.PI);
  const sparkX = useMotionValue(0);
  const sparkY = useMotionValue(0);

  function handleClick(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, width, bottom } = event.currentTarget.getBoundingClientRect();
    const xCenter = left + width / 2;
    const yCenter = bottom;
    const x = clientX - xCenter;
    const y = clientY - yCenter;
    const newAngle = Math.atan2(y, x);
    setAngle(newAngle);
    setTimeout(() => {
      const newValue = (newAngle / Math.PI) * 100 * 2 + 100;
      onChange(newValue);
    }, 200);
  }

  function handleMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, top } = event.currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    sparkX.set(x - 10);
    sparkY.set(y - 10);
  }

  useEffect(() => {
    const newAngle = ((value - 100) / 100 / 2) * Math.PI;
    setAngle(newAngle);
  }, [value]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={styles.gauge}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 1.005 }}
      >
        <m.div
          className={styles.dial}
          onPointerDown={handleClick}
          onMouseMove={handleMouseMove}
        >
          <m.div style={{ x: sparkX, y: sparkY }} className={styles.spark} />
        </m.div>
        <m.div
          style={{ y: "50%" }}
          animate={{ rotate: `calc(180deg + ${angle}rad)` }}
          className={styles.needle}
        />
      </m.div>
    </LazyMotion>
  );
}
