import React from 'react';
import CoinDropdown from "./components/CoinDropdown";
import {default as data} from "./data/coins.json"

function App() {


  return (
    <div className="app">
      <header className="header">
        <CoinDropdown coinList={data}/>
      </header>
    </div>
  );
}

export default App;
