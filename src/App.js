import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import SelectSourcePage from './Pages/SelectSourcePage';
import PlaylistsToBeMigrated from './Pages/PlaylistsToBeMigratedPage';
import SelectSink from './Pages/SelectSink';
import MigrateToSink from './Pages/MigrateToSinkPage';
import { usePlaylistsStore } from './Stores.js/PlaylistStore';
import HowToUse from './Pages/HowToUse';

function App() {
  const {pageIndex} = usePlaylistsStore((state) => ({pageIndex: state.pageIndex}))
  return (
    <BrowserRouter >
      <Routes >
        <Route path='/' element={<>
          {pageIndex === 0 && (<HomePage />)}
          {pageIndex === 1 && (<SelectSourcePage />)}
          {pageIndex === 2 && (<PlaylistsToBeMigrated />)}
          {pageIndex === 3 && (<SelectSink />)}
          {pageIndex === 4 && (<MigrateToSink />)}
        </>} />
        <Route path='/how-to-use' element={<HowToUse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
