// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useEffect, useRef } from "react"; // Import useRef
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
        formData.append("file", blob, "document.jpg"); // Append blob to FormData

        // Send blob to server
        const serverResponse = await fetch("http://localhost:5002/upload", {
          method: "POST",
          body: formData,
        });

        if (serverResponse.ok) {
          const jsonResponse = await serverResponse.json();
          console.log("Response message:", jsonResponse.message);
          console.log("File URL:", jsonResponse.fileUrl);

          // Add image via URL to the current page
          const image = new Image();
          image.src = jsonResponse.fileUrl;
          image.onload = async () => {
            try {
              // // Canvas
              // const blob = await fetch(jsonResponse.fileUrl).then((response) => response.blob());
              // await addOnUISdk.app.document.addImage(blob);
              // console.log("Image added to the document successfully.");
              // // Sidebar
              // const image = document.createElement("img");
              // // Set the width and height
              // image.width = 300; // Set the width to 300 pixels
              // image.height = 200; // Set the height to 200 pixels
              // // Image source
              // image.src = URL.createObjectURL(blob);
              // console.log("Preview URL:", image.src);
              // document.body.appendChild(image);
              // Canvas
              // const blob = await fetch(jsonResponse.fileUrl).then((response) => response.blob());
              // await addOnUISdk.app.document.addImage(blob);
              // console.log("Image added to the document successfully.");

              // Replace div with image
              const memeHolder = document.getElementById("memeHolder");
              const image = document.createElement("img");
              // Set the width and height
              image.width = 300; // Set the width to 300 pixels
              image.height = 200; // Set the height to 200 pixels
              // Image source
              image.src = URL.createObjectURL(blob);
              console.log("Preview URL:", image.src);

              // Remove all child nodes of memeHolder
              while (memeHolder.firstChild) {
                memeHolder.removeChild(memeHolder.firstChild);
              }

              // Append the image to memeHolder
              memeHolder.appendChild(image);
            } catch (error) {
              console.error("Failed to add the image to the page.", error);
            }
          };
          image.onerror = (error) => {
            console.error("Failed to load image from URL.", error);
          };
        } else {
          console.error("Failed to upload file");
        }
      } else {
        console.error("No blob found in response");
      }
    } catch (error) {
      console.error("Error creating renditions:", error);
    }
  };

  const displayPreview = async () => {
    try {
      const renditionOptions = {
        range: addOnUISdk.constants.Range.entireDocument,
        format: addOnUISdk.constants.RenditionFormat.png,
        backgroundColor: 0x7faa77ff,
      };
      const renditions = await addOnUISdk.app.document.createRenditions(
        renditionOptions,
        addOnUISdk.constants.RenditionIntent.preview
      );

      renditions.forEach((rendition) => {
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
      {/* <div className="container">
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
            </div> */}

      <div className="container">
        <h1 class="head1">WOW nice design!</h1>

        <h2 class="head2">kindly reminders of how nice your designs are :D</h2>

        <div id="memeHolder">
          <div>MEME</div>
        </div>

        <div className="generate">
          <div className="button-wrapper" onClick={handleClick}>
            <div className="text">Image</div>
            <div className="icon-wrapper">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_41_54)">
                  <path
                    d="M15.62 1.90503H14.86V14.86H15.62V1.90503Z"
                    fill="#000001"
                  />
                  <path
                    d="M14.86 14.86H1.90503V15.62H14.86V14.86Z"
                    fill="#000001"
                  />
                  <path
                    d="M14.095 1.14502H13.335V13.335H14.095V1.14502Z"
                    fill="#000001"
                  />
                  <path
                    d="M11.81 7.24004H10.285V8.00004H11.81V10.285H12.575V2.67004H11.81V7.24004Z"
                    fill="#000001"
                  />
                  <path
                    d="M10.285 9.52502H9.52498V10.285H2.66998V11.05H11.81V10.285H10.285V9.52502Z"
                    fill="#000001"
                  />
                  <path d="M10.285 8H9.52502V8.765H10.285V8Z" fill="#000001" />
                  <path
                    d="M9.52501 8.76501H8.76501V9.52501H9.52501V8.76501Z"
                    fill="#000001"
                  />
                  <path
                    d="M8.765 6.47505H10.285V5.71505H11.05V4.19005H10.285V3.43005H8.765V4.19005H8V5.71505H8.765V6.47505Z"
                    fill="#000001"
                  />
                  <path d="M8.765 8H8V8.765H8.765V8Z" fill="#000001" />
                  <path
                    d="M7.99999 7.23999H7.23999V7.99999H7.99999V7.23999Z"
                    fill="#000001"
                  />
                  <path
                    d="M7.23998 6.47498H6.47998V7.23998H7.23998V6.47498Z"
                    fill="#000001"
                  />
                  <path
                    d="M6.48002 5.71497H4.95502V6.47497H6.48002V5.71497Z"
                    fill="#000001"
                  />
                  <path
                    d="M4.955 6.47498H4.19V7.23998H4.955V6.47498Z"
                    fill="#000001"
                  />
                  <path
                    d="M4.18999 7.23999H3.42999V7.99999H4.18999V7.23999Z"
                    fill="#000001"
                  />
                  <path
                    d="M11.81 1.90503H2.66998V2.67003H11.81V1.90503Z"
                    fill="#000001"
                  />
                  <path
                    d="M2.67003 8.76504H3.43003V8.00004H2.67003V2.67004H1.90503V10.285H2.67003V8.76504Z"
                    fill="#000001"
                  />
                  <path
                    d="M13.335 0.380005H1.14502V1.145H13.335V0.380005Z"
                    fill="#000001"
                  />
                  <path
                    d="M13.335 13.335H1.14502V14.095H13.335V13.335Z"
                    fill="#000001"
                  />
                  <path
                    d="M1.145 1.14502H0.380005V13.335H1.145V1.14502Z"
                    fill="#000001"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_41_54">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div
            className="button-wrapper button-wrapper-video"
            onClick={handleDownload}
          >
            <div className="text">Video</div>
            <div className="icon-wrapper">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_41_87)">
                  <path
                    d="M15.24 0.76001H14.475V12.19H15.24V0.76001Z"
                    fill="#000001"
                  />
                  <path
                    d="M3.04501 12.1899V12.9499H3.81001V13.7149H4.57001V12.9499H6.09501V13.7149H6.85501V12.9499H8.38001V13.7149H9.14001V12.9499H10.665V13.7149H11.43V12.9499H12.19V13.7149H11.43V14.4749H9.90501V13.7149H9.14001V14.4749H7.62001V13.7149H6.85501V14.4749H5.33501V13.7149H4.57001V14.4749H3.04501V13.7149H2.28501V14.4749H0.76001V15.2399H12.19V14.4749H12.95V12.9499H14.475V12.1899H3.04501Z"
                    fill="#000001"
                  />
                  <path
                    d="M4.57001 8.38006H5.33501V9.14506H9.90501V8.38006H10.665V7.62006H11.43V8.38006H12.19V9.14506H12.95V3.81006H12.19V4.57006H11.43V5.33506H10.665V4.57006H9.90501V3.81006H5.33501V4.57006H4.57001V8.38006Z"
                    fill="#000001"
                  />
                  <path d="M14.475 0H3.04498V0.76H14.475V0Z" fill="#000001" />
                  <path
                    d="M2.28502 12.95H1.52502V13.715H2.28502V12.95Z"
                    fill="#000001"
                  />
                  <path
                    d="M1.525 12.95V12.19H0.76V10.665H1.525V9.90501H0.76V8.38001H1.525V7.62001H0.76V6.09501H1.525V5.33501H0.76V3.81001H1.525V3.04501H2.285V3.81001H1.525V4.57001H2.285V6.09501H1.525V6.85501H2.285V8.38001H1.525V9.14501H2.285V10.665H1.525V11.43H2.285V12.19H3.045V0.76001H2.285V2.28501H0.76V3.04501H0V14.475H0.76V12.95H1.525Z"
                    fill="#000001"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_41_87">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default App;
