// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useRef } from 'react'; // Import useRef
import "./App.css";

const App = ({ addOnUISdk, sandboxProxy }) => {
    const anchorRef = useRef(null);

    function handleClick() {
        sandboxProxy.createRectangle();
    }

    const handleDownload = async () => {
        try {
            console.log("Creating renditions...");
            const response = await addOnUISdk.app.document.createRenditions({
                range: "currentPage",
                format: "image/jpeg",
            });

            if (response && response[0] && response[0].blob) {
                const blob = response[0].blob;
                const formData = new FormData();
                formData.append('file', blob, 'document.jpg'); // Append blob to FormData

                // Send blob to server
                const serverResponse = await fetch('http://localhost:5002/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (serverResponse.ok) {
                    console.log('File successfully uploaded');
                } else {
                    console.error('Failed to upload file');
                }
            } else {
                console.error('No blob found in response');
            }
        } catch (error) {
            console.error('Error creating renditions:', error);
        }
    };

    const displayPreview = async () => {
        try {
            const renditionOptions = {
                range: addOnUISdk.constants.Range.entireDocument,
                format: addOnUISdk.constants.RenditionFormat.png,
                backgroundColor: 0x7FAA77FF
            };
            const renditions = await addOnUISdk.app.document.createRenditions(
                renditionOptions, addOnUISdk.constants.RenditionIntent.preview
            );

            renditions.forEach(rendition => {
                const image = document.createElement("img");
                image.src = URL.createObjectURL(rendition.blob);
                console.log("Preview URL:", image.src);
                document.body.appendChild(image);
            });
        } catch (error) {
            console.error("Failed to create renditions:", error);
        }
    };

    return (
        <Theme theme="express" scale="medium" color="light">
            <div className="container">
                <Button size="m" onClick={handleClick}>
                    Create Rectangle
                </Button>
                <Button size="m" onClick={handleDownload}>
                    Prepare Download
                </Button>
                <Button size="m" onClick={displayPreview}>
                    Display Preview
                </Button>
                <a href="#" download="document.jpg" ref={anchorRef} style={{ textDecoration: 'none', display: 'none' }}>
                    <span>Download</span>
                </a>
            </div>
        </Theme>
    );
};

export default App;
