import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");

    // Get the UI runtime.
    const { runtime } = addOnUISdk.instance;

    // Get the proxy object, which is required
    // to call the APIs defined in the Document Sandbox runtime
    // i.e., in the `code.js` file of this add-on.
    const sandboxProxy = await runtime.apiProxy("documentSandbox");

    const createRectangleButton = document.getElementById("createRectangle");
    createRectangleButton.addEventListener("click", async event => {
        await sandboxProxy.createRectangle();
    });

    // Enable the button only when:
    // 1. `addOnUISdk` is ready,
    // 2. `sandboxProxy` is available, and
    // 3. `click` event listener is registered.
    createRectangleButton.disabled = false;

    const prepareDownloadButton = document.getElementById("prepareDownload");
    prepareDownloadButton.addEventListener("click", async event => {
        // await sandboxProxy.createRectangle();
        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: "image/jpeg",
        });

        const downloadUrl = URL.createObjectURL(response[0].blob);
        document.getElementById("anchor").href = downloadUrl;
        console.log(downloadUrl);
        // response.forEach(rendition => {
        //     const image = document.createElement("img");
        //     image.src = URL.createObjectURL(rendition.blob);
        //     document.body.appendChild(image);
        // });

    });
    prepareDownloadButton.disabled = false;
});



