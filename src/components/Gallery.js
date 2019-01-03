import PropTypes from 'prop-types';
import React from 'react';
// import ReactDOM from 'react-dom';
import GridGallery from 'react-grid-gallery';


export class Gallery extends React.Component {
    static propTypes = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                caption: PropTypes.string,
                thumbnailWidth: PropTypes.number.isRequired,
                thumbnailHeight: PropTypes.number.isRequired
            })
        ).isRequired
    };
    /*
    constructor(props){
        super(props);
        this.state = {
            images: this.props.images
        };
    }
    */

    render () {
        var images =
                this.props.images.map((i) => {
                    return {
                        ...i,
                        customOverlay: (
                            <div style={captionStyle}>
                                <div>{i.caption}</div>
                            </div>    
                        )
                    };
                });


        return (
                <div style={wrapperStyle}>
                <GridGallery
                    backdropClosesModal
                    images={images}
                    enableImageSelection={false}/>
                </div>
        );
    }
}

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid #ddd",
        overflow: "auto"
};
/*
Gallery.defaultProps = {
    images: [
        {
            src: "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_b.jpg",
            thumbnail: "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_n.jpg",
            thumbnailWidth: 271,
            thumbnailHeight: 320,
            caption: "Orange Macro (Tom Eversley - isorepublic.com)"
        },
        {
            src: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
            thumbnail: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 190,
            caption: "286H (gratisography.com)"
        },
        {
            src: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
            thumbnail: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 213,
            caption: "201H (gratisography.com)"
        },
    ]
};
*/