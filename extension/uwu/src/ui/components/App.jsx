// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, {useEffect, useRef} from 'react'; // Import useRef
import "./App.css";

const App = ({ addOnUISdk, sandboxProxy }) => {
    const anchorRef = useRef(null);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         handleDownload();
    //     }, 10000);
    //
    //     // Cleanup interval on component unmount
    //     return () => clearInterval(interval);
    // }, []);

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
                    const jsonResponse = await serverResponse.json();
                    console.log('Response message:', jsonResponse.message);
                    console.log('File URL:', jsonResponse.fileUrl);

                    // Add image via URL to the current page
                    const image = new Image();
                    image.src = jsonResponse.fileUrl;
                    image.onload = async () => {
                        try {
                            // Canvas
                            const blob = await fetch(jsonResponse.fileUrl).then((response) => response.blob());
                            await addOnUISdk.app.document.addImage(blob);
                            console.log("Image added to the document successfully.");
                            // Sidebar
                            const image = document.createElement("img");
                            // Set the width and height
                            image.width = 300; // Set the width to 300 pixels
                            image.height = 200; // Set the height to 200 pixels
                            // Image source
                            image.src = URL.createObjectURL(blob);
                            console.log("Preview URL:", image.src);
                            document.body.appendChild(image);
                        } catch (error) {
                            console.error("Failed to add the image to the page.", error);
                        }
                    };
                    image.onerror = (error) => {
                        console.error("Failed to load image from URL.", error);
                    };
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
                    Send to Server
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
