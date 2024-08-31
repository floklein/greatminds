import { createStyles } from "antd-style";
import clsx from "clsx";
import colorAlpha from "color-alpha";

const useStyles = createStyles({
  place: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "1rem",
    fontWeight: 1000,
    fontSize: "1rem",
    textAlign: "center",
  },
  placeGold: {
    color: colorAlpha("#000", 0.7),
    background:
      "linear-gradient(90deg, #e7a334 0%, white 40%, #e7a334 60%, white 100%)",
    boxShadow: "inset 0 0 3px #da911a",
    border: "2px solid #b77a16",
  },
  placeSilver: {
    color: colorAlpha("#000", 0.7),
    background:
      "linear-gradient(90deg, #aeafb0 0%, white 40%, #aeafb0 60%, white 100%)",
    boxShadow: "inset 0 0 3px #9a9b9d",
    border: "2px solid #868889",
  },
  placeBronze: {
    color: colorAlpha("#000", 0.7),
    background:
      "linear-gradient(90deg, #c08040 0%, white 40%, #c08040 60%, white 100%)",
    boxShadow: "inset 0 0 3px #a36c36",
    border: "2px solid #86592c",
  },
});

export function Place({ place }: { place: number }) {
  const { styles } = useStyles();

  return (
    <div
      className={clsx(
        styles.place,
        place === 1 && styles.placeGold,
        place === 2 && styles.placeSilver,
        place === 3 && styles.placeBronze,
      )}
    >
      <span>{place}</span>
    </div>
  );
}
