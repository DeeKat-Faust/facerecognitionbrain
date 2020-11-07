import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxLocations }) => {
    console.log(boxLocations);
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img
                    id='inputImage'
                    src={imageUrl}
                    alt=''
                    width='1000px'
                    height='auto'
                />
                {
                    boxLocations.map(box => {
                        return <div
                            className='bounding-box'
                            style={{ top: box.top, right: box.right, bottom: box.bottom, left: box.left }}
                        >
                        </div>
                }) 
                }
            </div>
        </div>
    );
}

export default FaceRecognition;