import { useState } from "react";
import Filters from "../components/Filters";
import Products from "../components/Products";
import DataSorting from "../components/DataSorting";
import SearchBar from "../components/SearchBar"; // 🆕 Import nou

function Homepage() {
  const [filters, setFilters] = useState({
    category: "",
  });
  const [sorting, setSorting] = useState(1);

  return (
    <div className="homepageWrapper">
      {/* 🔍 Bara de căutare zboruri */}
      <SearchBar />

      {/* 🔻 Componentele tale deja existente */}
      <Filters setFilters={setFilters} />
      <div>
        <DataSorting setSorting={setSorting} />
        <Products filters={filters} sorting={sorting} />
      </div>
    </div>
  );
}

export default Homepage;
