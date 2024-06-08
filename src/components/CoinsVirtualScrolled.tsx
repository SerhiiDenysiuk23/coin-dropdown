import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ReactComponent as StarIcon} from "../assets/icons/star.svg";

interface Props {
  items: string[];
  itemHeight: number;
  containerHeight: number;
  favoriteCoins: string[]
  handleSetFavorite: (item: string) => void
}

const CoinsVirtualScrolled: React.FC<Props> = ({ items, itemHeight, containerHeight, favoriteCoins, handleSetFavorite }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);

  const totalHeight = items.length * itemHeight;

  const updateVisibleItems = useCallback(() => {
    const startIdx = Math.floor(scrollTop / itemHeight);
    const endIdx = Math.min(items.length - 1, Math.floor((scrollTop + containerHeight) / itemHeight));
    const newVisibleItems = items.slice(startIdx, endIdx + 1);
    setVisibleItems(newVisibleItems);
  }, [items, scrollTop, itemHeight, containerHeight]);

  // Обработчик прокрутки
  const onScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Установка обработчика прокрутки
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll);
      return () => {
        container.removeEventListener('scroll', onScroll);
      };
    }
  }, [onScroll]);

  // Обновление видимых элементов при изменении scrollTop или items
  useEffect(() => {
    updateVisibleItems();
  }, [scrollTop, items, updateVisibleItems]);

  // Корректировка scrollTop при изменении списка items
  useEffect(() => {
    if (scrollTop > totalHeight - containerHeight) {
      setScrollTop(Math.max(0, totalHeight - containerHeight));
    }
    // Обновляем видимые элементы после корректировки scrollTop
    updateVisibleItems();
  }, [items, totalHeight, containerHeight, scrollTop, updateVisibleItems]);

  return (
    <ul
      ref={containerRef}
      className="coin-dropdown__list"
      style={{ height: containerHeight, overflowY: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${Math.floor(scrollTop / itemHeight) * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <li key={Math.floor(scrollTop / itemHeight) + index}>
              <StarIcon
                className={`star-icon ${favoriteCoins.includes(item) ? "active" : ""}`}
                onClick={() => {
                  handleSetFavorite(item);
                }}
              /> {item}
            </li>
          ))}
        </div>
      </div>
    </ul>
  );
};
export default CoinsVirtualScrolled;