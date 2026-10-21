import React from "react";

function Loader(){
    return( <div className="loader-container"> 
                <div className="loader-spinner">
                    {/* icona di caricamento */}
                    </div> 
                <p className="loader-text">Attendi qualche istante e non cacare la minchia</p> 
            </div> );
    }

export default Loader;