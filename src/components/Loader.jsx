import React from "react";
import Spinner from "../../cassetto-degli-attrezzi/Spinner";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner">
        {/* icona di caricamento */}
        <Spinner />
      </div>
      <p className="loader-text">
        Attendi qualche istante e non cacare la minchia
      </p>
    </div>
  );
}

export default Loader;
