import { createStyles } from "antd-style";
import clsx from "clsx";
import { PropsWithChildren } from "react";

const useStyles = createStyles({
  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    flexGrow: 1,
  },
  item: {
    flexGrow: 0,
  },
});

interface Props {
  itemClassName?: string;
}

export function Center({ children, itemClassName }: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  return (
    <div className={styles.flex}>
      <div className={clsx(styles.item, itemClassName)}>{children}</div>
    </div>
  );
}
