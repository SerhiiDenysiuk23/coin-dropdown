import React, {useEffect, useRef, useState} from 'react';
import {ReactComponent as StarIcon} from "../assets/icons/star.svg";
import {ReactComponent as SearchIcon} from "../assets/icons/search.svg";
import CoinsVirtualScrolled from "./CoinsVirtualScrolled";

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
        setSearchQuery("")
        setActiveButton("All Coins")
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
      setCoinsToView(activeButton === "Favorites" ? favoriteCoins : coinList);
      return
    }

    const filteredCoins = (activeButton === "Favorites" ? favoriteCoins : coinList)
      .filter(item =>
        item.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    setCoinsToView(filteredCoins);

  }, [searchQuery, activeButton]);

  useEffect(() => {
    if (activeButton === 'Favorites') {
      setCoinsToView(favoriteCoins)
    } else {
      setCoinsToView(coinList)
    }

  }, [activeButton, favoriteCoins]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterClick = (buttonName: 'All Coins' | 'Favorites') => {
    setActiveButton(buttonName);
    setSearchQuery("")
  }

  const handleSetFavorite = (coin: string) => {
    if (favoriteCoins.includes(coin)) {
      setFavoriteCoins(favoriteCoins.filter(item => item !== coin));
    } else {
      setFavoriteCoins([...favoriteCoins, coin]);
    }
  }

  return (
    <div className={"coin-dropdown"} ref={dropdownRef}>
      <div onClick={() => {
        setDropDownToggle(prevState => !prevState)
      }} className={`coin-dropdown__toggle ${dropDownToggle ? "active" : ""}`}><SearchIcon className={"search-icon"}/> search
      </div>
      {
        dropDownToggle &&
        <div className={'coin-dropdown__body'}>
          <div className="coin-dropdown__header">
            <div className="coin-dropdown__search">
              <SearchIcon className={'search-icon'}/>
              <input type="search" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
            </div>
            <div className="coin-dropdown__filters">
              <button
                className={`coin-dropdown__filter-button ${activeButton === 'Favorites' ? 'active' : ''}`}
                onClick={() => handleFilterClick("Favorites")}
              >
                <StarIcon
                  className={`star-icon active`}
                />
                Favorites
              </button>
              <button
                className={`coin-dropdown__filter-button ${activeButton === 'All Coins' ? 'active' : ''}`}
                onClick={() => handleFilterClick("All Coins")}
              >All Coins
              </button>
            </div>

          </div>

          <CoinsVirtualScrolled itemHeight={38} containerHeight={350} items={coinsToView} favoriteCoins={favoriteCoins} handleSetFavorite={handleSetFavorite}/>
        </div>
      }
    </div>
  );
};

export default CoinDropdown;