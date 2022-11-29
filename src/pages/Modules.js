import React, { useState, useEffect } from 'react';

import { db } from './firebase';
import Module from '../components/Module';

function Modules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    db.collection('modules').get().then((sc) => {
      const module = [];
      sc.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;

        module.push(data);
      });

      setModules(module);
    });
  }, []);

  return modules.map((module) => (
    <div key={module.id}>
      <div>
        <Module
          title={module.title}
          // body={module.body}
          // attachment={module.attachments}
        />
        {/* <onclick ExpandedModules(module.id) */}
      </div>
    </div>
  ));
}

export default Modules;
