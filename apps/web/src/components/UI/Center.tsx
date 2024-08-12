import { Flex } from "antd";
import { createStyles } from "antd-style";
import clsx from "clsx";
import { PropsWithChildren } from "react";

const useStyles = createStyles({
  flex: {
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
    <Flex align="center" justify="center" className={styles.flex}>
      <div className={clsx(styles.item, itemClassName)}>{children}</div>
    </Flex>
  );
}
