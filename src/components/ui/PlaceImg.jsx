import React from 'react';

const PlaceImg = ({ place, index = 0, className = null }) => {
  const photos = place.photos?.split(',');

  

  if (!photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover';
  }
  return (
    <img
      src={`https://backend.sakanijo.com/api/images/${place.folderName}/${photos[index]}`}
      alt=""
      className={className}
    />
  );
};

export default PlaceImg;
