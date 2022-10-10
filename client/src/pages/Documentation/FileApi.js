import CardBox from "components/CardBox";

export default function FileApi() {
  return (
    <>
      <div className="bg-light-blue-500 px-3 md:px-8 h-18 mb-10" />
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-12/12 mb-12 px-4">
            <CardBox>
              <h1 className="text-2xl font-bold">API Endpoint</h1>
              <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                All requests for <b>single upload</b> to the API must be made to
                the following endpoint:
              </p>
              <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                <code>
                  {`${process.env.REACT_APP_BACKEND_URL}/api/v1/upload/single`}
                </code>
              </pre>

              <h1 className="text-2xl font-bold">API Endpoint</h1>
              <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                All requests for <b>multiple upload</b> to the API must be made
                to the following endpoint:
              </p>
              <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                <code>
                  {`${process.env.REACT_APP_BACKEND_URL}/api/v1/upload/multiple`}
                </code>
              </pre>
            </CardBox>

            <CardBox>
              <h1 className="text-2xl font-bold mb-4">Download</h1>
              <div className="relative flex text-sm flex-col min-w-0 break-word text-white w-full mb-6 shadow-lg rounded py-4 px-4 border-blue-700 border-4 bg-blue-500">
                Please use the Filestack CDN to download and/or serve files.
                Using the API is inefficient and incurs higher bandwidth costs.
              </div>

              <div className="overflow-auto w-full">
                <table className="items-center w-full bg-transparent border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Method
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        URL
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Returns
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                        GET
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>
                          {`${process.env.REACT_APP_BACKEND_URL}/download/{handle}`}
                        </code>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>File</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h1 className="text-2xl font-bold mb-4">Query Params</h1>
              <div className="overflow-auto w-full">
                <table className="items-center w-full bg-transparent border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Name
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Type
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                        disposition
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>String</code>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>inline</code> or <code>attachment</code>
                      </td>
                    </tr>
                    <tr className="">
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                        filename
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>String</code>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        The name of the file to be downloaded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBox>

            <CardBox>
              <h1 className="text-2xl font-bold mb-4">Store</h1>

              <p className="mb-4 text-sm leading-relaxed text-blueGray-700">
                Uploads a file directly to any of our supported backends. This
                will return JSON metadata, including a File Netzone URL for the
                file. You must provide your APIKEY as a header. And if you want
                to bulk/multiple upload, please using{" "}
                <code>multipart/form-data</code> as the request body and API
                endpoint Multiple upload.
              </p>

              <h1 className="text-2xl font-bold mb-4">Request</h1>
              <div className="overflow-auto w-full">
                <table className="items-center w-full bg-transparent border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Method
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        URL
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Returns
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                        POST
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>
                          {`${process.env.REACT_APP_BACKEND_URL}/api/v1/upload/{handle}`}
                        </code>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>JSON</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h1 className="text-2xl font-bold mb-4">Providers</h1>
              <p className="mb-4 text-sm leading-relaxed text-blueGray-700">
                We support multiple providers for file storage. You can choose
                which provider to use by setting the <code>provider</code> in
                the configuration api. The default provider is{" "}
                <code>local</code>.
              </p>

              <h1 className="text-2xl font-bold mb-4">Query Params</h1>
              <div className="overflow-auto w-full">
                <table className="items-center w-full bg-transparent border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Name
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Type
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                        files[]
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <code>File.*</code>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        The file to be uploaded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h1 className="text-2xl font-bold mb-4">Request</h1>
              <CardBox className="border bg-black text-white">
                <pre className="text-sm text-blueGray-700">
                  <code>
                    {`curl -X POST \\
-H "apikey: YOUR_API_KEY" \\
-H "Content-Type: multipart/form-data" \\
-F "files[]=@/path/to/file" \\
-F "files[]=@/path/to/file" \\
`}
                  </code>
                </pre>
              </CardBox>

              <h1 className="text-2xl font-bold mb-4">Response</h1>
              <CardBox className="border bg-black text-white">
                <pre className="text-sm text-blueGray-700">
                  <code>
                    {`{
    "success": true,
    "message": "File berhasil diunggah",
    "data": [
        {
            "name": "16ab23f6e648e1372b87f094f681b7ee-roti-tawar-goreng-isi-tuna (1).webp",
            "extension": "webp",
            "mime_type": "image/webp",
            "size": 67182,
            "url": "${process.env.REACT_APP_BACKEND_URL}/download/79a0988ffe5f854"
        },
        {
            "name": "adoc.pub_solusi-numerik-persamaan-fokker-planck-dengan-meto (1) (1) (1).pdf",
            "extension": "pdf",
            "mime_type": "application/pdf",
            "size": 1370820,
            "url": "${process.env.REACT_APP_BACKEND_URL}/download/757792720f5e9e8"
        },
        {
            "name": "adoc.pub_solusi-numerik-persamaan-fokker-planck-dengan-meto (1) (2).pdf",
            "extension": "pdf",
            "mime_type": "application/pdf",
            "size": 1370820,
            "url": "${process.env.REACT_APP_BACKEND_URL}/download/cf602918afb04c5"
        }
    ],
    "error": {
        "error_code": "",
        "error_data": []
    },
    "pagination": []
}`}
                  </code>
                </pre>
              </CardBox>
            </CardBox>
          </div>
        </div>
      </div>
    </>
  );
}
