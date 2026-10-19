// La prop speciale children: tutto ciò che viene scritto tra il tag
// di apertura e quello di chiusura del componente.

import "./ChildrenBase.css";

function Contenitore({ children }) { // function Contenitore({ children })  è una funzione che riceve come prop children che rappresenta tutto ciò che viene scritto tra il tag apertura e chiusura di Contenitore. Cioè, tutto ciò che viene scritto tra il tag apertura <Contenitore> e chiusura </Contenitore> di Contenitore viene passato come prop children.
  return <div className="contenitore">{children}</div>; //children=tutto ciò che viene scritto tra il tag apertura e chiusura di Contenitore. <Contenitore> <h1>Titolo</h1> <p>Questo è il contenuto passato come children.</p> </Contenitore> cioe  <h1>Titolo</h1> <p>Questo è il contenuto passato come children.</p>
  //Contenitore è il classico div stilizzato da css
  //quindi <div className="contenitore"></div>è come se dicessimo: 
  //<Contenitore> <h1>Titolo</h1> <p>Questo è il contenuto passato come children.</p> 

}

function ChildrenBase() {//  qui definiamo il componente ChildrenBase che riceve come prop children e lo passa al componente Contenitore. 
  return (
    <Contenitore>
      <h1>Titolo</h1>
      <p>Questo è il contenuto passato come children.</p>
    </Contenitore>
  );
}

function Contenitore1({ children }) { // function Contenitore({ children })  è una funzione che riceve come prop children che rappresenta tutto ciò che viene scritto tra il tag apertura e chiusura di Contenitore
  return <div className="contenitore1">{children}</div>;
}
function ChildrenBase1() {
  return (
    <Contenitore1>
      <h1>Titolo1</h1>
      <p>Questo è il contenuto passato come children1.</p>
    </Contenitore1>
  );
}



export {ChildrenBase, ChildrenBase1};

