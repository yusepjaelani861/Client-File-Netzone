import CardBox from "components/CardBox";
import RightBar from "./RightBar";

export default function ListFile() {
  const rightbar = [
    {
        name: "API Endpoint",
        link: "#endpoint",
    },
    {
        name: "List File",
        link: "#list",
    }
    ]
  return (
    <>
      <div className="bg-light-blue-500 px-3 md:px-8 h-18 mb-10" />
      <div className="lg:flex">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-12/12 mb-12 px-4">
            <CardBox>
              <h1 id="endpoint" className="text-2xl font-bold">API Endpoint</h1>
              <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                All request for get data from API must be sent to the following URL:
              </p>
              <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                <code>{`/api/v1/keys/files/list`}</code>
              </pre>
            </CardBox>

            <CardBox>
              <h1 id="list" className="text-2xl font-bold mb-5">List File API KEY</h1>
              <div className="w-full overflow-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                        Method
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          GET
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        <div className="text-sm text-gray-900">
                          /api/v1/keys/files/list
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        <div className="text-sm text-gray-900">
                          List all files
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-bold mt-10 mb-5">Request Sample</h2>
              <CardBox className="bg-black text-white">
                <pre>
                  <code>
                    {`curl -X GET \\
    ${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/files/list \\
    -H 'apikey: <API_KEY>'`}
                  </code>
                </pre>
              </CardBox>

              <h2 className="text-xl font-bold mt-10 mb-5">Response Sample</h2>
              <CardBox className="bg-black text-white">
                <div className="w-full overflow-auto">
                  <pre>
                    <code>
                      {`{
    "success": true,
    "message": "Berhasil mendapatkan daftar file",
    "data": [
        {
            "id": 1,
            "user_id": 2,
            "storage_id": 2,
            "api_key_id": 2,
            "name": "16ab23f6e648e1372b87f094f681b7ee-roti-tawar-goreng-isi-tuna (1).webp",
            "name_encrypted": "29b39e3fbf51327a3aba752852489854d1b49749",
            "path": "folder/29b39e3fbf51327a3aba752852489854d1b49749",
            "extension": "webp",
            "mime_type": "image/webp",
            "size": "67182",
            "hash": "fb90fa23e65b401337eb02e64d0f22e0933063ad",
            "disk": "local",
            "url": "4d5157a75ffa841",
            "created_at": "2022-10-10T02:26:01.000000Z",
            "updated_at": "2022-10-10T02:26:01.000000Z"
        },
        {
            "id": 2,
            "user_id": 2,
            "storage_id": 2,
            "api_key_id": 2,
            "name": "2943-8541-1-SM.pdf",
            "name_encrypted": "a30c35907ed6139f8ed27b888a4f903da37ff2b9",
            "path": "folder/a30c35907ed6139f8ed27b888a4f903da37ff2b9",
            "extension": "pdf",
            "mime_type": "application/pdf",
            "size": "762639",
            "hash": "73e4a6637f33a3704a2fa0840b3b554c9189a044",
            "disk": "local",
            "url": "41b3999040c7086",
            "created_at": "2022-10-10T02:26:01.000000Z",
            "updated_at": "2022-10-10T02:26:01.000000Z"
        }
    ],
    "error": {
        "error_code": "",
        "error_data": []
    },
    "pagination": {
        "total": 2,
        "per_page": 10,
        "current_page": 1,
        "last_page": 1,
        "first_page_url": "${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/files/list?page=1",
        "last_page_url": "${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/files/list?page=1",
        "next_page_url": null,
        "prev_page_url": null,
        "from": 1,
        "to": 2
    }
}`}
                    </code>
                  </pre>
                </div>
              </CardBox>
            </CardBox>
          </div>
        </div>
      </div>
       <RightBar data={rightbar} />
      </div>
    </>
  );
}
