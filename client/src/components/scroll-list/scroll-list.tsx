import { useEffect, useState } from 'react';

interface ScrollListProps {
  list: unknown[];
  renderItem: (value: unknown, index: number, array: unknown[]) => JSX.Element;
  numberOfVisibleItems: number;
  wrap: (
    itemList: JSX.Element[],
    onWheel: (i: React.WheelEvent<HTMLUListElement>) => void,
  ) => JSX.Element;
  startBottom?: boolean;
}

export default function ScrollList({
  list,
  renderItem,
  wrap,
  numberOfVisibleItems,
  startBottom,
}: ScrollListProps): JSX.Element {
  const [topItem, setTopItem] = useState<number>(
    startBottom ? list.length - 1 - numberOfVisibleItems : 0,
  );

  useEffect(() => {
    setTopItem(startBottom ? list.length - 1 - numberOfVisibleItems : 0);
  }, [list.length]);

  const startIndex = topItem;
  const endIndex = topItem + numberOfVisibleItems;

  const visualList = list.slice(startIndex, endIndex + 1);

  const showList = visualList.map(renderItem);
  const onWheel = ({ deltaY }: React.WheelEvent<HTMLUListElement>): void => {
    if (deltaY > 15) {
      setTopItem(
        topItem + 1 > list.length - 1 - numberOfVisibleItems
          ? list.length - 1 - numberOfVisibleItems
          : topItem + 1,
      );
    } else if (deltaY < -15) {
      setTopItem(topItem - 1 < 0 ? 0 : topItem - 1);
    }
  };
  return wrap(showList, onWheel);
}
