import React from "react";
import Spinner from "./Spinner";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner">
        {/* icona di caricamento */}
        <Spinner />
      </div>
    </div>
  );
}

export default Loader;
