
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import Module from '../components/Module';

function Modules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    db.collection('modules').get().then((sc) => {
      const card = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        card.push(data);
      });
      setModules(card);
    });
  }, []);

  return modules.map((card) => (
    <div key={card.id}>
      <Module
        title={card.title}
        <Link to="/expandedonboarding" onClick={() => <ExpandedModule title={card.title} body={card.body} attachments={card.attachments}/>} />
        {/* // body={card.body} */}
        {/* // attachments={card.attachments} */}
      />
    </div>
  ));
}

export default Modules;