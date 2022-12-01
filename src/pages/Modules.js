import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <Link to="/expandedmodule" state={{ title: card.title, body: card.body, attachments: card.attachments }}>
        <Module
          title={card.title}
        />
      </Link>
    </div>
  ));
}

export default Modules;
