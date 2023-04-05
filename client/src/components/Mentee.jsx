// import { React, useState, useEffect } from 'react';
// import PropTypes, { string } from 'prop-types';
// import { Link } from 'react-router-dom';
// import {
//   ref, getStorage, getDownloadURL,
// } from 'firebase/storage';
// import styles from '../styles/Modules.module.css';

// function Mentee(props) {
//   const {
//     title, body, attachments, child, link,
//   } = props;

//   const [img, setImg] = useState('');
//   console.log(img);

//   const setImageURL = (imgLink) => {
//     if (imgLink.length > 0) {
//       const storage = getStorage();
//       const spaceRef = ref(storage, imgLink);
//       getDownloadURL(spaceRef).then((url) => {
//         setImg(url);
//       }).catch((error) => {
//         console.error(error.message);
//       });
//     } else {
//       setImg('');
//     }
//   };

//   useEffect(() => { setImageURL(link); }, [link]);

//   return (
//     <div>
//       <div className={styles.title}>{title}</div>
//       <div className={styles.body}>{body}</div>
//       <div className={styles.attachments}>{attachments}</div>
//       {/* keep bottom code for reference */}
//       {/* <div>
//         {link.map((image) => {
//             return (
//               <div key={image} className="image">
//                   <img src={image} alt="" width="40%" height="auto" />
//               </div>
//             );
//         })}
//       </div> */}
//       <img src={img} alt="" width="30%" height="auto" />
//       {
//         child.map((kid) => (
//           <Link to="/expanded-module" state={{ id: kid.id }} key={kid.id}>
//             <div className={styles.card}>
//               <h1>{kid.title}</h1>
//             </div>
//           </Link>
//         ))
//       }
//     </div>
//   );
// }

// Mentee.propTypes = {
//   title: PropTypes.string.isRequired,
//   body: PropTypes.string.isRequired,
//   attachments: PropTypes.string.isRequired,
//   child: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     role: PropTypes.arrayOf(string).isRequired,
//   })).isRequired,
//   link: PropTypes.string,
// };

// Mentee.defaultProps = {
//   link: '',
// };

// export default Mentee;
