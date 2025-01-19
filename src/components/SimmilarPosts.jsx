import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // For React Router in React JS
import { useTranslation } from 'react-i18next'; // For translations
import './SimilarProducts.css'; // Ensure you have the corresponding CSS file for styling

const SimilarProducts = ({ homeType, sellType, placeId }) => {
  const [similarAds, setSimilarAds] = useState([]);
  const { t } = useTranslation(); // Translation hook

  useEffect(() => {
    // Axios fetch data with homeType and sellType
    axios.get('https://backend.sakanijo.com/similar-products', {
      params: {
        homeType,
        sellType,
        placeId,
      },
    })
    .then(response => {
      setSimilarAds(response.data); // Assuming response.data contains the list of ads
    })
    .catch(error => {
      console.error('Error fetching data:', error.response);
    });
  }, [homeType, sellType]); // Re-fetch when homeType or sellType changes

  return (
    <div className="container">
      <div className="cards-container">
        {similarAds.map((item) => {
          const photos = item.photos ? item.photos.split(",") : [];
          return (
            <Link key={item.id} to={`https://place.sakanijo.com/place?id=${item?.id}`} className="cardSimmilar">
              <div className="card-image-container">
                <img
                  src={`https://backend.sakanijo.com/api/images/${encodeURIComponent(item.folderName)}/${encodeURIComponent(photos[0])}`}
                  alt={item.title}
                  className="card-image"
                />
              </div>
              <div className="card-details">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-price">{item.price} JOD</p>
                <p className="card-address">{item.address}</p>

                <p className="card-address">{item?.description?.slice(0, 200) }</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarProducts;
