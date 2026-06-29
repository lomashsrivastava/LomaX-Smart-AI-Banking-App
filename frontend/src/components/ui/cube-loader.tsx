import React from 'react';
import './cube-loader.css';

const CubeLoader = () => {
  return (
    <div className="cube-wrapper">
      <div className="cube-loading">
        <div className="cube">
          <div className="side front" />
          <div className="side back" />
          <div className="side top" />
          <div className="side bottom" />
          <div className="side left" />
          <div className="side right" />
        </div>
      </div>
    </div>
  );
};

export default CubeLoader;
