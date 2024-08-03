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
                console.log("Renditions created:", response);
                const downloadUrl = URL.createObjectURL(response[0].blob);
                console.log("Download URL:", downloadUrl);

                // Set the href of the anchor element
                if (anchorRef.current) {
                    anchorRef.current.href = downloadUrl;
                    anchorRef.current.style.display = 'block'; // Show the download button
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
