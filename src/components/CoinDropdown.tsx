import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ReactComponent as StarIcon} from "../assets/icons/star.svg";
import {FixedSizeList as List} from 'react-window';

const CoinDropdown: React.FC<{ coinList: string[] }> = ({coinList}) => {
  const [dropDownToggle, setDropDownToggle] = useState(false)
  const [coinsToView, setCoinsToView] = useState(coinList ?? [])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeButton, setActiveButton] = useState<'All Coins' | 'Favorites'>('All Coins');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [favoriteCoins, setFavoriteCoins] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteCoins');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  })


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropDownToggle(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
  }, [favoriteCoins]);

  useEffect(() => {
    if (searchQuery === "") {
      setCoinsToView(coinList);
    } else {
      setActiveButton("All Coins")
      const filteredCoins = coinList.filter(item =>
        item.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setCoinsToView(filteredCoins);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (activeButton === 'Favorites') {
      setCoinsToView(favoriteCoins)
    } else {
      setCoinsToView(coinList)
    }

  }, [activeButton]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterClick = (buttonName: 'All Coins' | 'Favorites') => {
    setActiveButton(buttonName);
  }

  const handleSetFavorite = (coin: string) => {
    if (favoriteCoins.includes(coin)) {
      setFavoriteCoins(favoriteCoins.filter(item => item !== coin));
    } else {
      setFavoriteCoins([...favoriteCoins, coin]);
    }
  }

  const renderRow = ({index, style}: { index: number, style: React.CSSProperties }) => (
    <div className={"coin-dropdown__list__elem"} style={style} key={coinsToView[index]}>
      <StarIcon
        className={`star-icon ${favoriteCoins.includes(coinsToView[index]) ? "active" : ""}`}
        onClick={() => {
          handleSetFavorite(coinsToView[index])
        }}
      /> {coinsToView[index]}
    </div>
  );

  return (
    <div className={"coin-dropdown"} ref={dropdownRef}>
      <div onClick={() => {
        setDropDownToggle(prevState => !prevState)
      }} className={'coin-dropdown__toggle'}>search
      </div>
      {
        dropDownToggle &&
        <div className={'coin-dropdown__body'}>
          <div className="coin-dropdown__header">
            <div className="coin-dropdown__search">
              <input type="search" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
            </div>
            <div className="coin-dropdown__filters">
              <button
                className={`coin-dropdown__filter-button ${activeButton === 'Favorites' ? 'active' : ''}`}
                onClick={() => handleFilterClick("Favorites")}
              >Favorites
              </button>
              <button
                className={`coin-dropdown__filter-button ${activeButton === 'All Coins' ? 'active' : ''}`}
                onClick={() => handleFilterClick("All Coins")}
              >All Coins
              </button>
            </div>

          </div>
          <List
            className={"coin-dropdown__list"}
            height={500}
            itemCount={coinsToView.length}
            itemSize={30}
            width="100%"
          >
            {renderRow}
          </List>
        </div>
      }
    </div>
  );
};

export default CoinDropdown;