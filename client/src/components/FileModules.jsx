import { React } from 'react';
import moduleStyles from '../styles/Modules.module.css';

export const ImageModule = () => {
    return (
        <div>
            <div className={moduleStyles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <img className={moduleStyles.displayImg} src={file.url} alt={file.fileName} />
            </div>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={imgIcon} alt="img icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
    )
}

export const VideoModule = () => {
  return (
    <div>
            <div className={moduleStyles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <video className={moduleStyles.displayImg} controls src={file.url} alt={file.fileName}>
                <track default kind="captions" />
              </video>
            </div>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file)) ? (
                  <Checkbox
                    checked={checked.includes(file.url)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={vidIcon} alt="video icon" />)}
              </div>
              <div className={moduleStyles.fileName}>{file.fileName}</div>
            </div>
          </div>
  )
}

export const PDFModule = () => {
  return (
    <div>
            <div className={moduleStyles.preview} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">
              <embed className={moduleStyles.displayImg} src={file.url} alt={file.fileName} />
            </div>
            <div className={moduleStyles.descriptionContainer}>
              <div
                key={file.fileID}
                onMouseEnter={() => handleMouseEnter(file.url)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={file.imageSrc} alt={file.name} />
                {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                  <Checkbox
                    checked={checked.includes(file)}
                    onChange={(event) => handleCheckboxChange(event, file)}
                    className={moduleStyles.checkbox}
                  />
                ) : (<img src={pdfIcon} alt="pdf icon" />)}
              </div>
              <div className={`${moduleStyles.fileName} ${moduleStyles.pdf_preview}`} onClick={() => (handleClickOpenFilePopup(file))} role="presentation">{file.fileName}</div>
            </div>
          </div>
  )
}

export const LinkModule = () => {
  return (
    <div>
            <a href={file.url} target="_blank" rel="noreferrer">
              <div className={moduleStyles.preview}>
                <embed className={moduleStyles.displayImg} src={file.url} alt={file.fileName} />
              </div>
              <div className={moduleStyles.descriptionContainer}>
                <div
                  key={file.fileID}
                  onMouseEnter={() => handleMouseEnter(file.url)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={file.imageSrc} alt={file.name} />
                  {(checked.length > 0) || (hoveredFile === file.url) || (checked.includes(file.url)) ? (
                    <Checkbox
                      checked={checked.includes(file)}
                      onChange={(event) => handleCheckboxChange(event, file)}
                      className={moduleStyles.checkbox}
                    />
                  ) : (<img className={styles.smaller_img} src={linkIcon} alt="link icon" />)}
                </div>
                <div className={`${moduleStyles.fileName} ${moduleStyles.pdf_preview}`}>{file.fileName}</div>
              </div>
            </a>
          </div>
  )
}